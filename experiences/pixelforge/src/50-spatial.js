// ── World Maps (spatial context) client ───────────────────────────────────────
// Authority rule (exploration §02): spatial context owns where the party is;
// the tile world is a view of it. Reads go through the same REST endpoint the
// host uses; writes ride sendMessage's third argument with optimistic
// concurrency. A location change with no in-flight command is narrated drift:
// teleport to the bound zone (or toast), never queue a compensating transition.
PF.spatial = {
  data: null, // last SpatialContextResponse (or null: unbound / not fetched)
  available: false,
  pending: null, // {commandId, destinationId, name}
  _lastLocationId: null,
  _refreshing: false,

  reset() {
    this.data = null;
    this.available = false;
    this.pending = null;
    this._lastLocationId = null;
  },

  locationName() {
    const b = this.data?.breadcrumb;
    return b && b.length ? b[b.length - 1].name : null;
  },

  destinations() {
    const d = this.data?.destinations;
    if (!Array.isArray(d)) return [];
    return d
      .map((entry) => ({
        id: typeof entry.id === "string" ? entry.id : typeof entry.locationId === "string" ? entry.locationId : null,
        name: typeof entry.name === "string" ? entry.name : "(unnamed)",
      }))
      .filter((entry) => entry.id);
  },

  async refresh(core) {
    if (this._refreshing || !core.chatId) return;
    this._refreshing = true;
    try {
      const data = await PF.api.getSpatial(core.chatId);
      // Both degraded modes (verified trap #6): endpoint absent (package not
      // installed) OR a game that fell back to standard mode (definition null /
      // disabled). Either way the world runs on package state alone.
      this.available = !!(data && data.definition && data.currentLocationId);
      this.data = this.available ? data : null;
      if (!this.available) return;

      const loc = data.currentLocationId;
      // Seed the starting binding: first location we ever see maps to the exterior.
      const world = core.sim?.world;
      if (world && Object.keys(world.bindings).length === 0) {
        world.bindings[loc] = "village";
        world.zones.village.spatialLocationId = loc;
        core.markDirty();
      }
      if (this.pending && (loc === this.pending.destinationId || loc !== this._lastLocationId)) {
        this.pending = null; // transition landed (or was superseded server-side)
      } else if (this._lastLocationId && loc !== this._lastLocationId && !this.pending) {
        // Narrated drift — the GM moved the party. Follow it; never compensate.
        const zoneId = world?.bindings[loc];
        if (zoneId && core.sim && core.sim.zoneId !== zoneId) {
          const spawn = world.zones[zoneId].spawn;
          core.sim.teleport(zoneId, spawn.x, spawn.y);
        }
        core.hud?.toast(`Now at: ${this.locationName() ?? loc}`);
      }
      this._lastLocationId = loc;
      core.hud?.refreshChips();
    } catch (err) {
      // Network/parse trouble is not fatal to the world — stay on package state.
      console.warn("[pixelforge] spatial refresh failed", err);
    } finally {
      this._refreshing = false;
    }
  },

  /** Travel via the host generation pipeline. 409s surface as a toast + refetch. */
  async travel(core, dest) {
    if (!this.available || !core.host?.sendMessage || core.sim?.mode !== "walk") return;
    const transition = {
      destinationId: dest.id,
      expectedDefinitionRevision: this.data.definition.revision,
      expectedCurrentLocationId: this.data.currentLocationId,
      commandId: PF.uid(),
    };
    this.pending = { commandId: transition.commandId, destinationId: dest.id, name: dest.name };
    core.hud?.toast(`Traveling to ${dest.name}…`);
    try {
      const text = `${core.sim.header()} We travel to ${dest.name}.`;
      await core.host.sendMessage(text, undefined, transition);
    } catch (err) {
      this.pending = null;
      core.hud?.toast(`Travel could not start — the map may have changed. Try again.`);
      await this.refresh(core);
      PF.fail(null, err);
    }
  },
};
