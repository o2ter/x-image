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

import _ from 'lodash';
import cv from 'opencv4nodejs';
import { BitmapFormat, ImageBase, ImageData } from '../../image/base';
import { binaryToBuffer } from '@o2ter/utils-js';

const instanceOf = (x: any): x is cv.Mat => x instanceof cv.Mat;

class _ImageBase extends ImageBase<cv.Mat> {

  constructor(data: ImageData | cv.Mat) {
    if (instanceOf(data)) {
      super(data);
    } else {
      const image = new cv.Mat(binaryToBuffer(data.buffer), data.height, data.width)
      super(image);
    }
  }

  width() {
    return this._native.cols;
  }

  height() {
    return this._native.rows;
  }

  format() {
    const { type } = this._native;
    switch (true) {
      case type === cv.CV_8UC1: return BitmapFormat.Gray8;
      case type === cv.CV_8UC3: return BitmapFormat.RGB24;
      case type === cv.CV_8UC4: return BitmapFormat.RGBA32;
      default: throw Error('Unknown format');
    }
  }

  raw(): ImageData {
    return {
      buffer: this._native.getData(),
      width: this._native.cols,
      height: this._native.rows,
      format: this.format(),
      premultiplied: false,
    };
  }

  clone() {
    return new _ImageBase(this._native.copy());
  }

  destroy() {
    super.destroy();
    this._native.release();
  }
}

export const loadOpenCV = () => ({
  instanceOf,
  ImageBase: _ImageBase,
});
