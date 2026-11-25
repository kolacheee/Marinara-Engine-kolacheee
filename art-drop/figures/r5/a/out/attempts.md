# Generation attempts

Every candidate is retained unmodified in `raw/`. Prompts are alongside this log.

Threshold fixed before scoring: at least 99% of foreground cells have an RGB range of at most 3 levels and at least 95% are exactly flat. Exact lossless reconstruction would require a separate check after this gate. Magenta-only cells are excluded to prevent empty background inflating the score. Every integer cell size consistent with a 50–64px figure envelope and every x/y offset is searched. These are best-fit candidates, not claims that a genuine regular grid exists.

| Attempt | Best cell / offset | Exactly flat | Nearly flat | Mixed | Mean within-cell RGB variance | Decision |
|---|---|---:|---:|---:|---:|---|
| hadrik-01 | 16px / [14, 12] | 0.000% | 14.160% | 85.840% | 1411.907 | REJECT |
| hadrik-02 | 10px / [5, 6] | 0.000% | 3.545% | 96.455% | 1338.414 | REJECT |
| hadrik-03 | 10px / [8, 3] | 0.000% | 5.070% | 94.930% | 1192.175 | REJECT |
| hadrik-04 | 13px / [2, 12] | 0.000% | 6.492% | 93.508% | 1760.878 | REJECT |
| wren-01 | 7px / [0, 3] | 0.000% | 0.863% | 99.137% | 1192.538 | REJECT |
| wren-02 | 9px / [8, 2] | 0.000% | 3.067% | 96.933% | 1599.180 | REJECT |
| wren-03 | 16px / [7, 8] | 0.000% | 4.143% | 95.857% | 1556.354 | REJECT |
| wren-04 | 14px / [10, 0] | 0.000% | 11.956% | 88.044% | 1291.011 | REJECT |

Raw images have not been downscaled, resampled, quantized, repainted or converted into sprite assets.
