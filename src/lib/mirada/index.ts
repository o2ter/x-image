//
//  index.js
//
//  The MIT License
//  Copyright (c) 2021 - 2024 O2ter Limited. All rights reserved.
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

import cv from 'mirada';
import { BitmapFormat, ImageBase, ImageData } from '../../image/base';

const instanceOf = (x: any): x is cv.File => x instanceof cv.File;

class _ImageBase extends ImageBase<cv.File> {

  constructor(data: ImageData | cv.File) {
    if (instanceOf(data)) {
      super(data);
    } else {
      super(cv.File.fromData({
        data: data.buffer,
        width: data.width,
        height: data.height,
      }));
    }
  }

  width() {
    return this._native.width;
  }

  height() {
    return this._native.height;
  }

  raw() {
    const { data, width, height } = this._native.asImageData();
    const channels = this._native.asMat().channels();
    return {
      buffer: data,
      width,
      height,
      channels: channels === 1 ? BitmapFormat.Gray8 : BitmapFormat.RGBA32,
      premultiplied: false,
    };
  }

  clone() {
    return new _ImageBase(this._native.clone());
  }

  destory() {
    super.destory();
    this._native.delete();
  }
}

let loaded = false;
const _loadMirada = async () => {
  if (loaded) return;
  loaded = true;
  await cv.loadOpencv();
}

export const loadMirada = async () => {
  await _loadMirada();
  return {
    instanceOf,
    ImageBase: _ImageBase,
  };
}
