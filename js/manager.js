/**
 * @fileoverview 全景图demo展示
 * @authors xiaoyue
 */

$(document).ready(function(){
    var doc = document;
    $(doc).on("touchstart touchmove mousedown mousemove",function(event){
        // var tag = $(event.target).parents()[0].tagName;
        // var thistag = event.target.tagName;
        // if ( tag != "A" ){
        event.preventDefault();
        // }
    });
    var loading = $('.loading');
    var tip = $('.tips');

    function view(){
        var camera, scene, renderer, controls;
        //初始化全景
        function init() {
            //创建透视投影相机
            camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

            //创建场景
            scene = new THREE.Scene();

            //创建物体
            var cube = generateCubeMap(650);

            //将物体添加到场景中
            scene.add( cube );

            //创建渲染器
            renderer = new THREE.CSS3DRenderer();
            renderer.setSize( window.innerWidth, window.innerHeight );

            //追加到dom节点
            $(".cover").before( renderer.domElement );

            // Add DeviceOrientation Controls
            controls = new DeviceOrientationController( camera, renderer.domElement );
            controls.connect();
            
            //监听屏幕旋转变化
            window.addEventListener( 'resize', onWindowResize, false );
        }
        //循环渲染
        function animate() {
            controls.update();
            renderer.render( scene, camera );
            requestAnimationFrame( animate );
        }

        function generateCubeMap(tileWidth ) {
            var flipAngle  = Math.PI;       // 180 degrees
            var rightAngle = flipAngle / 2; //  90 degrees

            tileWidth = tileWidth || 512;
            //纹理贴图数据
            var sides = [
                {
                    url: './textures/2_2.jpg',
                    position: [ - tileWidth, 0, 0 ],
                    rotation: [ 0, rightAngle, 0 ]
                },
                {
                    url: './textures/2_4.jpg',
                    position: [ tileWidth, 0, 0 ],
                    rotation: [ 0, - rightAngle, 0 ]
                },
                {
                    url: './textures/2_0.jpg',
                    position: [ 0, tileWidth, 0 ],
                    rotation: [ rightAngle, 0, flipAngle*(1/2)]
                },
                {
                    url: './textures/2_5.jpg',
                    position: [ 0, - tileWidth, 0 ],
                    rotation: [ -rightAngle, 0, flipAngle*(1/2) ]
                },
                {
                    url: './textures/2_1.jpg',
                    position: [ 0, 0, tileWidth ],
                    rotation: [ 0, flipAngle, 0 ]
                },
                {
                    url: './textures/2_3.jpg',
                    position: [ 0, 0, - tileWidth ],
                    rotation: [ 0, 0, 0 ]
                }
            ];

            //创建几何体
            var cube = new THREE.Object3D();
            for (var i = 0; i < sides.length; i++){
                var side = sides[ i ];
                var element = $('<div class="btn_box btn_'+ i +'" style="width:'+ (tileWidth * 2 + 2) +'px; background:url('+ side.url +')"></div>');
                var object = new THREE.CSS3DObject( element[0]);

                object.position.fromArray( side.position );
                object.rotation.fromArray( side.rotation );
                cube.add( object );
            }
            return cube;
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
        }

        function addDom(){
            var element = $('.page_2');
            // element.find(".btn_0").append("<div class='shu' style='display:block;'><div class='point'></div></div>");
            element.find(".btn_1").append('<div class="qiuxie" style="display:block;"></div>');
            element.find(".btn_4").append('<div class="qiuxie" style="display:block;"></div>');
            element.find(".btn_5").append('<div class="qiuxie" style="display:block;"></div>');
            element.find(".qiuxie").off().on("touchend",function(event){
                element.find(".cover").show();
                element.find(".qiuxie_cover").show();
            });
            element.find(".shu").off().on("touchend",function(){
               element.find(".cover").show();
                element.find(".qiuxie_cover").show();
            });
            element.find(".qiuxie_cover").off().on('touchend', function(event){
                element.find(".cover").hide();
                element.find(".qiuxie_cover").hide();
            });
        }

        function tips(){
            tip.show();
            setTimeout(function(){
                tip.hide();
            },5000);
        }
        init();
        animate();
        addDom();
        tips();
    }

    var CONFIG = {
        list : ['./textures/2_0.jpg','./textures/2_1.jpg','./textures/2_2.jpg','./textures/2_3.jpg','./textures/2_4.jpg','./textures/2_5.jpg']
    };

    var status = {
        imgload0 : false,
        imgload1 : false,
        imgload2 : false,
        imgload3 : false,
        imgload4 : false,
        imgload5 : false
    };

    function setHtmlSize(){
        var docEl = doc.documentElement;
        var clientWidth = docEl.clientWidth;
        var win = $(window);

        if (!clientWidth) return;
        if(win.width()>win.height()){
            docEl.style.fontSize = 100 * (clientWidth / 1136) + 'px';
        }else{
            docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
        }
    }
    function checkLoad(type){
        status[type] = true;
        var result = Object.keys(status).every(function(key){
            return status[key];
        });

        if(result){
            //图片准备完成 开始渲染全景
            loading.hide();
            view();
        }
    }
    function loadTextturesComplete(list){
        list.forEach(function(item,idx){
            var img = new Image();
            img.src = item;
            img.onload = function(){
                checkLoad('imgload' + idx);
            };
        });
    }
    setHtmlSize();
    loading.show();
    loadTextturesComplete(CONFIG.list);

    //请求接口,获取纹理图
    // var getTextures = setInterval(function(){
    //     $.ajax({
    //         url : '',
    //         dataType : 'jsonp',
    //         success : function(res){
    //             if(res.list ===  6){
    //                 clearInterval('getTextures');
    //                 CONFIG.list = res.list;
    //                 //确保6张图完全加载完成
    //             }
    //         }
    //     })
    // });
});