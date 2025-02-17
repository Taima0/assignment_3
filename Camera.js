class Camera {
  constructor() { 
    this.position = new Vector3([0, 0, 0]); //eye
    this.direction = new Vector3([0, 0, -1]);  //at
    this.up = new Vector3([0, 1, 0]); //up
    this.rightVector = new Vector3([1, 0, 0]); 
    this.speed = 0.1; 
  }

  //forward
  forward() {
    let movement = new Vector3(this.direction.elements);
    movement.mul(this.speed);
    this.position.add(movement);
  }

  // backward
  back() {
    let movement = new Vector3(this.direction.elements);
    movement.mul(this.speed);
    this.position.sub(movement);
  }

  //left
  left() {
    let movement = new Vector3(this.rightVector.elements);
    movement.mul(this.speed);
    this.position.sub(movement);
  }

  //right
  right() {
    let movement = new Vector3(this.rightVector.elements);
    movement.mul(this.speed);
    this.position.add(movement);
  }

  
  rotateLeft() {
    let Q = new Vector3([0, 0, 0]);
    let newvec = new Vector3([0, 0, 0]);
    Q.set(this.direction.sub(this.position)); 

    let rotate = new Matrix4();
    rotate.setRotate(3.5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    
    let Q_bar = rotate.multiplyVector3(Q);

    newvec.set(this.position);
    this.direction = newvec.add(Q_bar); 
}

rotateRight() {
    let Q = new Vector3([0, 0, 0]);
    let newvec = new Vector3([0, 0, 0]);
    Q.set(this.direction.sub(this.position)); 

    let rotate = new Matrix4();
    rotate.setRotate(-3.5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    
    let Q_bar = rotate.multiplyVector3(Q);

    newvec.set(this.position);
    this.direction = newvec.add(Q_bar);
}

}
