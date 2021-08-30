import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

/*
    making a 3d web project starter kit to keep projects cleaner than usual 
    (lmao like it would be hard to be cleaner than THAT)
*/
let game;

class BasicThreeScene
{
    _cubePos = [0,0,0];
    _cameraPos = [0,0,60];
    constructor(){
        // get your shit together
        this._threeDeeZone = document.getElementById('threeDeeHolder');
        this._raycaster = new THREE.Raycaster();
        this._scene = new THREE.Scene();
        this._renderer = new THREE.WebGLRenderer({antialias:true, alpha: true});
        this._renderer.setPixelRatio(window.devicePixelRatio*0.35);
        this._renderer.setSize(this._threeDeeZone.clientWidth, this._threeDeeZone.clientWidth);
        this._renderer.setClearColor(0x000000,0);
        this._camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 1000);
        this._camera.position.set(this._cameraPos[0],this._cameraPos[1],this._cameraPos[2]);
        this._scene.background = new THREE.Color('grey');
        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.update();
        this._controls.enableDampening = true;
        // WASD
        //this._controls.keys = {LEFT:65, UP:87, RIGHT:68, BOTTOM:83};
        // ARROWS
        this._controls.keys = {LEFT:37, UP:38, RIGHT:39, BOTTOM:40};

        // the junk u gonna look at
        this._cube = this.getCube();
        this._light = this.getLight();
        this._scene.add(this._cube);
        this._scene.add(this._light);

        // just throwing this out there
        this._ambientLight = new THREE.AmbientLight( 0x222222 );
        this._scene.add(this._ambientLight);
        this._threeDeeZone.appendChild(this._renderer.domElement);
        
        // listen to me!
        //this._threeDeeZone.addEventListener("click", _ => console.log("ouch!"));
        window.addEventListener("resize", _ => {this.onWindowResize()});
        // DO IT    (please note, setInterval is a temporary solution until i fix the requestanimationframe)
        this._animator = setInterval(_=>{this.animate()},50);
    }
    onWindowResize(){
        this._camera.aspect = window.innerWidth/window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }
    getCube(){
        let cubeTexture = new THREE.TextureLoader().load("./dalma.jpg");
        let cuber = new THREE.Mesh(new THREE.CubeGeometry(5,5,5), new THREE.MeshBasicMaterial({color:0xffff00d,map:cubeTexture, flatShading:false}));
        cuber.position.set(this._cubePos[0],this._cubePos[1],this._cubePos[2]);
        return cuber;
    }
    getStar(){
        //let star = new THREE.Mesh(new THREE.);
    }
    getLight(){
        let light = new THREE.AmbientLight( 0xffffff );
        light.position.set(20,20,20);
        return light;
    }
    animate() {
        //window.requestAnimationFrame(this.animate);
        //console.log("animating :P");
        this._controls.update();
        //this._controls.target.set(this._cubePos[0],this._cubePos[1],this._cubePos[2]);
        this._renderer.render(this._scene, this._camera);
    }
}

window.addEventListener("DOMContentLoaded", _ => game = new BasicThreeScene());
export default BasicThreeScene;