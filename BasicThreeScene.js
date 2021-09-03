import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
//import * as AmmoPhysics from 'https://cdn.jsdelivr.net/npm/ammo-node@1.0.0/ammo.min.js';
//import * as Ammo from 'https://cdn.jsdelivr.net/npm/ammo.js@0.0.10/ammo.min.js';

/*
    making a 3d web project starter kit to keep projects cleaner than usual 
    (lmao like it would be hard to be cleaner than THAT)
*/
let game;

class BasicThreeScene
{
    _cubePos = [0,5,0];
    _cameraPos = [50,30,50];
    objects = {};
    constructor(){
        // get your shit together
        this._threeDeeZone = document.getElementById('threeDeeHolder'); // **
        this._raycaster = new THREE.Raycaster();
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color('blue');
        this._renderer = new THREE.WebGLRenderer({antialias:true, alpha: true}); // **
        //this._renderer.setPixelRatio(window.devicePixelRatio*0.35);
        this._renderer.setSize(this._threeDeeZone.clientWidth, this._threeDeeZone.clientHeight);
        this._renderer.setClearColor(0xffffff,0);
        this._camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 5000);
        this._camera.position.x = this._cameraPos[0];
        this._camera.position.y = this._cameraPos[1];
        this._camera.position.z = this._cameraPos[2];
        //this._camera.position.set(this._cameraPos[0],this._cameraPos[1],this._cameraPos[2]);
        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.update();
        this._controls.minDistance = 10;
        this._controls.maxDistance = 100;
        this._controls.enableDampening = true;
        this._controls.dampeningFactor = 0.05;
        this._controls.target.set(this._cubePos[0],this._cubePos[1],this._cubePos[2]);

        // WASD
        //this._controls.keys = {LEFT:65, UP:87, RIGHT:68, BOTTOM:83};
        // ARROWS
        this._controls.keys = {LEFT:37, UP:38, RIGHT:39, BOTTOM:40};

        // the junk u gonna look at
        this.getCube(this._cubePos[0],this._cubePos[1],this._cubePos[2]);
        this._light = this.getLight();
        this._ground = this.getGround();
        this._scene.add(this._ground);
        this._scene.add(this._light);

        // just throwing this out there
        this._ambientLight = new THREE.AmbientLight( 0xffffff );
        this._scene.add(this._ambientLight);
        this._threeDeeZone.appendChild(this._renderer.domElement); // ** 
        
        // listen to me!
        this._threeDeeZone.addEventListener("click", _ => this.output());
        window.addEventListener("resize", _ => {this.onWindowResize()});
        this.animate();
    }
    onWindowResize(){
        this._camera.aspect = window.innerWidth/window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }
    getCube(x,y,z){
        let cubeTexture = new THREE.TextureLoader().load("./dalma.jpg");
        this.cuber = new THREE.Mesh(new THREE.CubeGeometry(5,5,5), new THREE.MeshBasicMaterial({color:0xfffffff,map:cubeTexture, flatShading:false}));
        this.cuber.position.set(x,y,z);
        this.cuber.data = "fuck lmao";
        this.cuber.update = _ => {
            this.cuber.rotation.x += 0.01;
            this.cuber.rotation.y += 0.01;
            this.cuber.rotation.z += 0.01;
        }
        // add to objects collection
        this.objects.cuber = this.cuber;
        this._scene.add(this.cuber);
    }
    output(){
        console.log(this.cuber.data);
        console.log(Object.entries(this.objects));
        console.log(Object.keys(this.objects)[0]);
        console.log(this.objects["cuber"]);
    }
    getGround(){
        let groundTexture = new THREE.TextureLoader().load("./checker1.jpg");
        let groundGeometry = new THREE.PlaneBufferGeometry(1000,1000);
        let groundMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, map: groundTexture});
        let ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        ground.position.set(0,0,0);
        ground.material.map.repeat.set(10,10);
        ground.material.map.wrapS = THREE.RepeatWrapping;
        ground.material.map.wrapT = THREE.RepeatWrapping;
        return ground;
    }
    getLight(){
        let light = new THREE.PointLight( 0xffffff );
        light.position.set(-20,20,-20);
        let gridHelper = new THREE.GridHelper(200,0);
        let lightHelper = new THREE.PointLightHelper(light);
        this._scene.add(lightHelper);
        return light;
    }
    animate() {
        window.requestAnimationFrame(_ => {this.animate()});
        this._controls.update();

        this._controls.target.set(this._cubePos[0],this._cubePos[1],this._cubePos[2]);
        // TODO: spin off logic to run all of the objects' "update" commands on every animate frame
        // Object.keys(this.objects) will return an array of keys for the 
        if(this.objects["cuber"]!=undefined) this.objects["cuber"].update();
        this._renderer.render(this._scene, this._camera);
    }
}

window.addEventListener("DOMContentLoaded", _ => {
    game = new BasicThreeScene();
    getLastCommitDate();
    //game.getCube(0,5,0);
});
let getLastCommitDate = async _ => {
    let data = await fetch(`https://api.github.com/repos/ivanwo/threeTemplate/events`).then(response => response.json()).then(body => body[0].created_at);
    let timestamp = document.getElementById('timestamp');
    timestamp.innerText = data;
}
//export default BasicThreeScene;