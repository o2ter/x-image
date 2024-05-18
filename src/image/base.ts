//
//  base.js
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

import _ from 'lodash';
import { Awaitable } from '@o2ter/utils-js';

export enum BitmapFormat {
  Gray8,
  RGB24,
  RGBA32,
  CMYK32,
};

export interface ImageData {
  buffer: ArrayBufferView;
  width: number;
  height: number;
  format: BitmapFormat;
  premultiplied: boolean;
  space?: string | Buffer;
}

export const isImageData = (x: any): x is ImageData => ArrayBuffer.isView(x.buffer)
  && _.isSafeInteger(x.width)
  && _.isSafeInteger(x.height)
  && _.includes(_.values(BitmapFormat), x.channel)
  && _.isBoolean(x.premultiplied)

export abstract class ImageBase<Native> {

  _native: Native;
  _destroyed: boolean = false;

  constructor(native: Native) {
    this._native = native;
  }

  abstract width(): Awaitable<number>;
  abstract height(): Awaitable<number>;
  abstract format(): Awaitable<BitmapFormat>;
  
  colorspace(): Awaitable<string | Buffer | undefined> {
    return undefined;
  }

  abstract raw(): Awaitable<ImageData>;

  abstract clone(): ImageBase<Native>;

  destory() {
    if (this._destroyed) throw Error('Cannot destroy a destroyed image');
    this._destroyed = true;
  }
}
