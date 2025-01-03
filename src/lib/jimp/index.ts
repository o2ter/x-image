//
//  index.js
//
//  The MIT License
//  Copyright (c) 2021 - 2025 O2ter Limited. All rights reserved.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//

import Jimp from 'jimp';
import { ImageBase, BitmapFormat, ImageData } from '../../image/base';
import { Awaitable, binaryToBuffer } from '@o2ter/utils-js';

const instanceOf = (x: any): x is Jimp => x instanceof Jimp;

class _ImageBase extends ImageBase<Jimp> {

  constructor(data: ImageData | Jimp) {
    if (instanceOf(data)) {
      super(data);
    } else {
      const image = new Jimp({
        data: binaryToBuffer(data.buffer),
        width: data.width,
        height: data.height,
      });
      super(image);
    }
  }

  width() {
    return this._native.bitmap.width;
  }

  height() {
    return this._native.bitmap.height;
  }

  format() {
    return this._native.hasAlpha() ? BitmapFormat.RGBA32 : BitmapFormat.RGB24;
  }

  raw() {
    return {
      buffer: this._native.bitmap.data,
      width: this.width(),
      height: this.height(),
      format: this.format(),
      premultiplied: false,
    };
  }

  clone() {
    return new _ImageBase(this._native.clone());
  }

}

export const loadJimp = () => ({
  instanceOf,
  ImageBase: _ImageBase,
});

