import {defs, tiny} from './examples/common.js';
import {Shape_From_File, Bump_Map_Texture, Bump_Mapped_Grass} from './ObjectLoading.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Cube, Axis_Arrows, Textured_Phong, Cone_Tip} = defs

export class Final extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        this.shapes = {
            box_1: new Cube(),
            roof: new Cone_Tip(),
            house: new Shape_From_File("assets/house_updated.obj"),
            pumpkin: new Shape_From_File("assets/pumpkin.obj"),
            snowman: new Shape_From_File("assets/snowman.obj"),
            surfboard: new Shape_From_File("assets/surfboard.obj")
        }

        this.materials = {
            phong: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),}),
            texture_grass: new Material(new Texture_Grass(), {
                color: hex_color("#000000"),
                ambient: 0.9, diffusivity: 0.9, specularity: 0.1,
                texture: new Texture("assets/grass.jpg","NEAREST"),
            }),
            bumped_grass: new Material(new Bump_Mapped_Grass(), {
                color: hex_color("#000000"),
                ambient: 0.9, diffusivity: 0.9, specularity: 0.1,
                texture: new Texture("assets/grass.jpg","NEAREST"),
                bump_map: new Texture("assets/grass_bump.png")
            }),
            snowy_grass: new Material(new Texture_Grass(), {
                color: hex_color("#000000"),
                ambient: 0.9, diffusivity: 0.9, specularity: 0.1,
                texture: new Texture("assets/snowy_grass.jpg","NEAREST"),
            }),
            texture_sky: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 0.9, diffusivity: 0.5, specularity: 0.5,
                texture: new Texture("assets/clouds.jpg","NEAREST"),
            }),
            bumped_sky: new Material(new Bump_Map_Texture(), {
                color: hex_color("#000000"),
                ambient: 0.9, diffusivity: 0.5, specularity: 0.5,
                texture: new Texture("assets/clouds.jpg","NEAREST"),
                bump_map: new Texture("assets/clouds_bumped.png")
            }),
            snowy_sky: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 0.9, diffusivity: 0.5, specularity: 0.5,
                texture: new Texture("assets/snow_clouds.jpg","NEAREST"),
            }),
            house: new Material(new Textured_Phong(), {
                ambient: .6, diffusivity: .8, specularity: .9,
                texture: new Texture("assets/Blender Files/HouseTexture_new.png")
            }),
            bumped_house: new Material(new Bump_Map_Texture(), {
                ambient: .6, diffusivity: .8, specularity: .9,
                texture: new Texture("assets/Blender Files/HouseTexture_new.png"),
                bump_map: new Texture("assets/Blender Files/house_bump_map2.png")
            }),
            pumpkin: new Material(new Textured_Phong(), {
                ambient: .6, diffusivity: .8, specularity: .9,
                texture: new Texture("assets/Blender Files/pumpkin.png")
            }),
            bumped_pumpkin: new Material(new Bump_Map_Texture(), {
                ambient: .6, diffusivity: .8, specularity: .9,
                texture: new Texture("assets/Blender Files/pumpkin.png"),
                bump_map: new Texture("assets/Blender Files/house_bump_map2.png")
            }),
            snowman: new Material(new Textured_Phong(), {
                ambient: .6, diffusivity: .8, specularity: .9,
                texture: new Texture("assets/Blender Files/snowman.png")
            }),
            bumped_snowman: new Material(new Bump_Map_Texture(), {
                ambient: .6, diffusivity: .8, specularity: .9,
                texture: new Texture("assets/Blender Files/snowman.png"),
                bump_map: new Texture("assets/Blender Files/house_bump_map2.png")
            }),
            surfboard: new Material(new Textured_Phong(), {
                ambient: .6, diffusivity: .8, specularity: .9,
                texture: new Texture("assets/Blender Files/surfboard.png")
            }),
            bumped_surfboard: new Material(new Bump_Map_Texture(), {
                ambient: .6, diffusivity: .8, specularity: .9,
                texture: new Texture("assets/Blender Files/surfboard.png"),
                bump_map: new Texture("assets/Blender Files/house_bump_map2.png")
            })
        }
        this.amb = 0.9
        this.f = 0.0015
        this.day_night_time = 0
        this.sun_position = vec4(10, 10, 10, 1);
        this.sun_brightness = 5000
        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
        this.house_material = 0;

        this.season = 0;
        this.change_time = 1;

    }

    make_control_panel() {
        this.key_triggered_button("Toggle Day/Night Cycle", ["c"], () => {
            this.change_time ^= 1;
        });
        this.key_triggered_button("Toggle Bump Maps", ["b"], () => {
            this.house_material = ~this.house_material;
        });
    }




    draw_house(context, program_state) {
        this.shapes.house.draw(context, program_state, Mat4.identity().times(
            Mat4.rotation(Math.PI / 6, 0, 1, 0)
        ).times(
            Mat4.scale(4, 4, 4)
        ), (this.house_material
            ? this.materials.bumped_house : this.materials.house)
            .override({ambient: this.sun_brightness / 5000 + .1}));
    }

    draw_pumpkin(context, program_state) {
        this.shapes.pumpkin.draw(context, program_state, Mat4.identity()
            .times(
                Mat4.translation(7, -2, 3)
            )
            .times(
                Mat4.rotation(-10*Math.PI/16, 0, 1, 0)
        ).times(
            Mat4.scale(.7, .7, .7)
        ), (this.house_material
            ? this.materials.bumped_pumpkin : this.materials.pumpkin)
            .override({ambient: this.sun_brightness / 5000 + .1}));
    }

    draw_snowman(context, program_state) {
        this.shapes.snowman.draw(context, program_state, Mat4.identity()
            .times(
                Mat4.translation(7, -.8, 3)
            )
            .times(
                Mat4.rotation(-11*Math.PI/16, 0, 1, 0)
            ).times(
                Mat4.scale(1, 1, 1)
            ), (this.house_material
            ? this.materials.bumped_snowman : this.materials.snowman)
            .override({ambient: this.sun_brightness / 5000 + .1}));
    }

    draw_surfboard(context, program_state) {
        this.shapes.surfboard.draw(context, program_state, Mat4.identity()
            .times(
                Mat4.translation(7, -1.5, 3)
            )
            .times(
                Mat4.rotation(-11*Math.PI/16, 0, 1, 0)
            ).times(
                Mat4.scale(1, 1, 1)
            ), (this.house_material
            ? this.materials.bumped_surfboard : this.materials.surfboard)
            .override({ambient: this.sun_brightness / 5000 + .1}));
    }



    draw_background(context, program_state) {

        let model_transform = Mat4.identity();
        model_transform = model_transform.times(Mat4.scale(100,100,1))

        let sky_mat = this.materials.texture_sky;
        let ground_mat = this.materials.texture_grass;
        switch (this.season) {
            case 1:
                ground_mat = this.materials.fall_ground;
                break;
            case 2:
                sky_mat = this.materials.snowy_sky;
                ground_mat = this.materials.snowy_grass;
                break;
            case 3:
                ground_mat = this.materials.spring_ground;
        }
        let model_transform_3 = model_transform.times(Mat4.translation(0,0,-20))
        this.shapes.box_1.draw(context, program_state, model_transform_3,
            sky_mat.override({ambient: this.sun_brightness / 5000 + .1}
            ));

        let model_transform_2 = Mat4.translation(0, -3.8, 0)
            .times(Mat4.scale(100,1,100))
            .times(Mat4.rotation(Math.PI/2, 1, 0, 0))

        ;
        this.shapes.box_1.draw(context, program_state, model_transform_2,
            ground_mat.override({ambient: this.sun_brightness / 5000 + .1}));
    }


    day_night(context, program_state) {

        let x = 40*Math.cos(2*Math.PI*this.f*this.day_night_time)
        let y = 20*Math.sin(2*Math.PI*this.f*this.day_night_time)

        this.sun_position = vec4(x, y, 10, 1);
/*        if (y<-4){
            this.sun_brightness = 0
            program_state.lights = [new Light(this.sun_position, color(1, 1, 1, 1), this.sun_brightness)];

        }else{
            this.sun_brightness = 1000
            program_state.lights = [new Light(this.sun_position, color(1, 1, 1, 1), this.sun_brightness)];
        }*/
        this.sun_brightness = (y + 20) * 5000 / 40;
        program_state.lights = [new Light(this.sun_position, color(1, 1, 1, 1), this.sun_brightness)];


    }

    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(-1.68, -0.34, -20.35));
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        let t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000

        if (this.change_time) {
            this.day_night_time = this.day_night_time + 1
            this.day_night(context, program_state)
            this.amb = Math.min((Math.sin(2*Math.PI*this.f*this.day_night_time)+1.7)/2, 1)
            this.materials.texture_sky.ambient = this.amb
            this.materials.texture_grass.ambient = this.amb

        } else {
            program_state.lights = [new Light(this.sun_position, color(1, 1, 1, 1), this.sun_brightness)];
        }

        this.season = 0;

        this.draw_background(context, program_state)
        this.draw_house(context, program_state)

        //this.draw_pumpkin(context, program_state)
        //this.draw_snowman(context, program_state);
        this.draw_surfboard(context, program_state);



    }
}




class Texture_Grass extends Textured_Phong {
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){
                // Sample the texture image in the correct place:
                vec4 tex_color = texture2D( texture, vec2(f_tex_coord.x*20.0, f_tex_coord.y*20.0));
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}
