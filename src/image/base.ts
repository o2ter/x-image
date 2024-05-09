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

export enum xImageChannel {
  Gray,
  RGB,
  RGBA,
}

export const channelsMap = {
  [xImageChannel.Gray]: 1,
  [xImageChannel.RGB]: 3,
  [xImageChannel.RGBA]: 4,
} as const;

export interface ImageData {
  buffer: ArrayBufferView;
  width: number;
  height: number;
  channel: xImageChannel;
  premultiplied: boolean;
}

export abstract class ImageBase<Native> {

  _native: Native;
  _destroyed: boolean = false;

  constructor(native: Native) {
    this._native = native;
  }

  abstract toImageData(): ImageData;

  destory() {
    if (this._destroyed) throw Error('Cannot destroy a destroyed image');
    this._destroyed = true;
  }
}
