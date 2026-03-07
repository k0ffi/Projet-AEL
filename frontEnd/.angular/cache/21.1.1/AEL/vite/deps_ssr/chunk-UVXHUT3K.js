import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { MatRipple } from './chunk-DYWT6TPD.js';
import { BidiModule } from './chunk-WHITI2DF.js';
import {
  NgModule,
  setClassMetadata,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
} from './chunk-XL6YDQ22.js';

// node_modules/@angular/material/fesm2022/_ripple-module-chunk.mjs
var MatRippleModule = class _MatRippleModule {
  static ɵfac = function MatRippleModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatRippleModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _MatRippleModule,
    imports: [MatRipple],
    exports: [MatRipple, BidiModule],
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [BidiModule],
  });
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      MatRippleModule,
      [
        {
          type: NgModule,
          args: [
            {
              imports: [MatRipple],
              exports: [MatRipple, BidiModule],
            },
          ],
        },
      ],
      null,
      null,
    );
})();

export { MatRippleModule };
//# sourceMappingURL=chunk-UVXHUT3K.js.map
