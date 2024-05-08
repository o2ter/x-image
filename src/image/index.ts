//
//  index.ts
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

import Jimp from 'jimp';
import cv from 'mirada';
import type sharp from 'sharp';
import { xImageBase, xImageData } from './base';
import { loadJimp } from '../lib/jimp';
import { loadMirada } from '../lib/mirada';
import { loadSharp } from '../lib/sharp';

export class xImage {

  private _base: xImageBase<any>

  private constructor(base: xImageBase<any>) {
    this._base = base;
  }

  static fromImageData(image: xImageData) {
    const { ImageBase } = loadSharp() ?? loadJimp();
    const base = new ImageBase(image);
    return new xImage(base);
  }

  static fromJimp(image: Jimp) {
    const { ImageBase } = loadJimp();
    const base = new ImageBase(image);
    return new xImage(base);
  }

  static async fromOpenCV(image: cv.File) {
    const { ImageBase } = await loadMirada();
    const base = new ImageBase(image);
    return new xImage(base);
  }

  static fromSharp(image: sharp.Sharp) {
    const { ImageBase } = loadSharp() ?? {};
    if (!ImageBase) throw Error('Sharp is not supported');
    const base = new ImageBase(image);
    return new xImage(base);
  }

  toImageData() {
    return this._base.toImageData();
  }
}
