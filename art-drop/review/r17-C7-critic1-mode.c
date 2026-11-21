#include <stdint.h>
#include <stdlib.h>
#include <string.h>
void magenta(uint8_t *p, int n) {
  for(int i=0;i<n;i++,p+=4){int r=p[0],g=p[1],b=p[2];
    if(r>80 && b>80 && g*2<(r<b?r:b) && b*.55<r && r<b*1.8) memset(p,0,4);
    else p[3]=255;
  }
}
void mode64(const uint8_t *idx,const uint8_t *alpha,uint8_t *out,int w,int h){
  for(int y=0;y<h;y++)for(int x=0;x<w;x++){
    unsigned char count[256]={0};
    for(int dy=0;dy<8;dy++)for(int dx=0;dx<8;dx++){
      int k=(y*8+dy)*w*8+x*8+dx;count[alpha[k]>=128?idx[k]+1:0]++;
    }
    int best=0;for(int k=1;k<256;k++)if(count[k]>count[best])best=k;
    out[y*w+x]=best;
  }
}
int cleanup(uint8_t *a,int w,int h,int outline,int dark){
  uint8_t *p=malloc(w*h);memcpy(p,a,w*h);int changed=0;
  for(int y=1;y<h-1;y++)for(int x=1;x<w-1;x++){
    int i=y*w+x,q=p[i];if(!q)continue;
    int offsets[8]={-w-1,-w,-w+1,-1,1,w-1,w,w+1};
    int near[8],opaque=0,found=0;
    for(int k=0;k<8;k++){near[k]=p[i+offsets[k]];opaque+=!!near[k];found|=near[k]==q;}
    if(opaque<2)a[i]=0;
    else if(!found && opaque==8){
      int best=near[0],bestn=0;
      for(int k=0;k<8;k++){int n=0;for(int j=0;j<8;j++)n+=near[k]==near[j];if(n>bestn){best=near[k];bestn=n;}}
      a[i]=best;
    }
  }
  if(outline){memcpy(p,a,w*h);for(int y=0;y<h;y++)for(int x=0;x<w;x++){
    int i=y*w+x;if(p[i] && (!x||!y||x==w-1||y==h-1||!p[i-1]||!p[i+1]||!p[i-w]||!p[i+w]))a[i]=dark;
  }}
  free(p);return changed;
}
