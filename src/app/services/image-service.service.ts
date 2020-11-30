import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageServiceService {

  constructor() { }

  delImage(name: string) {
    let storageRef = firebase.storage().ref();
    let imageRef = storageRef.child('scope-app').child('fotos').child(name);
    return imageRef.delete();
  }
}
