/**
 * Created by Fakebounce on 13/11/2016.
 */

import React from 'react';
import Dungeon from './Dungeon';
import WorldMap from './WorldMap';
import SignOut from '../auth/SignOut';
import { Block, View, Text, Image,Loading } from '../app/components';
import { connect } from 'react-redux';
import { firebase } from '../../common/lib/redux-firebase';
import { cancelDungeon,LoadDungeons,LoadSkills,CanUseSkill, LoadWeapons, preLoadActiveDungeon, loadWorldMap, ReloadWorldMap,LoadViewer,LoadTutoRef,LoadNextStep,LoadViewerRef,LoadStep } from '../../common/dungeons/actions';

let Dungeons = ({ tutoriel, loaded,verifloaded, dungeons,dungeonsOP,preLoadActiveDungeon,cancelDungeon,CanUseSkill,LoadViewer, loadWorldMap, viewer,dviewer, LoadTutoRef, LoadStep,LoadNextStep }) => {
    let weapon_list = '';
    var skills_list = '';
    let dungeon;
    let health = 100;
    let maxhealth = 100;
    let energy = 100;
    let maxenergy = 100;
    let experience = 0;
    let maxexperience = 1000;
    let skill_function = false;

    if(!dviewer)
    {
        LoadViewer(viewer);
    }
    else
    {
        if (dviewer.weapons) {
            weapon_list = dviewer.weapons.map(weapon => {
                let classObjet = weapon.get ? 'weapon ' + weapon.css : 'weapon objetVide';
                return (<div key={weapon.id} className={classObjet}></div>);
            });
        }

        if(dviewer.tuto && dviewer.tuto < 5)
        {
            if(typeof tutoriel === 'undefined' || tutoriel == null)
            {
                LoadStep(dviewer);
            }
        }
        else if(dungeonsOP)
        {
            var dungeonActive = false;
            var wdmap = [];
            dungeonsOP.map(dungeonOP => dungeon = dungeonOP);
            // dungeonsOP.toList().map(dungeonOP => rows = dungeonOP.dungeon.maptiles.length);
            // dungeonsOP.toList().map(dungeonOP => cols = dungeonOP.dungeon.maptiles[0].length);

            if(dungeon)
            {
                if(dungeon.user.default_character)
                {
                    maxhealth = dungeon.user.default_character.maxhealth;
                    health = dungeon.user.character.health;
                    energy = dungeon.user.character.energy;
                    maxenergy = dungeon.user.default_character.maxenergy;
                    experience = dungeon.user.character.experience;
                    maxexperience = dungeon.user.default_character.maxexperience;
                }
                dungeonActive = true;

                if(dviewer.characters[dviewer.active].equipped_spells) {
                    var cpt = 0;
                    skills_list = dviewer.characters[dviewer.active].equipped_spells.map(skill => {
                        var classSkill = 'skill';
                        if(dungeonActive)
                        {
                            skill_function = function(sk){
                                CanUseSkill(dungeon,dviewer,sk);
                            };
                        }
                        cpt++;
                        var skill_image = "assets/images/skills/"+skill.image;
                      return (<div className="oneSkill"><span>{cpt}</span><Image key={skill.id} className={`skills ${classSkill}`} onClick={() => skill_function(skill)} src={skill_image}></Image><div className="info"><h3>{skill.name}</h3><h4>Description: {skill.description}</h4><ul><li>Action cost: {skill.action_cost}</li><li>Energy cost: {skill.energy_cost}</li><li>Damage instant: {skill.damage_instant}</li><li></li></ul></div></div>);
                    })
                }

                if(dviewer && typeof dungeon.dungeon !== "undefined")
                {
                    wdmap.push(<WorldMap key={dungeon.dungeon.id} worldmap={dungeon.dungeon} dungeon={dungeon}/>);
                }
            }
            else {
                if(dviewer && !dviewer.active_dungeon)
                {
                    preLoadActiveDungeon(dviewer);
                }
                dungeonActive = false;
            }

        }
    }
    var displayDiv = "dungeons";

    //tuto
    var classN = "";
    var classStep = "";
    if(dviewer && tutoriel){
        classN = "overlay";
        if(tutoriel.class){
            classStep = tutoriel.class;
        }
    }
    var health_percent = health/maxhealth * 100;
    let healthbar = "<div class='progress vertical-life'><div class='progress-bar progress-bar-life' role='progressbar' aria-valuenow='"+health+"' aria-valuemin='0' aria-valuemax='"+maxhealth+"' style='width:"+health_percent+"%;'></div></div>";
    var energy_percent = energy/maxenergy * 100;
    let energybar = "<div class='progress vertical-mana'><div class='progress-bar progress-bar-mana' role='progressbar' aria-valuenow='"+energy+"' aria-valuemin='0' aria-valuemax='"+maxenergy+"' style='width:"+energy_percent+"%;'></div></div>";

    return (
        <View className={classStep}>

            <div className={classN}>
            </div>

            <Block>{dviewer && tutoriel &&
            <div className="cadre-tutoriel">
                <div className="tuto-text">{tutoriel.description}</div>
                <div onClick={() => LoadNextStep(dviewer,tutoriel.next)} className="tuto-next">Next</div>
            </div>
            }
            </Block>
            <View className="container_app-img"></View>
            <View className="container_app">
                <div className="cadre-gauche-max">
                    <div className="personnage"></div>
                    <div className="personnage-info">
                        <div className="personnage-info-pseudo">
                            Pseudo
                        </div>
                        <div className="personnage-info-class">
                            Class
                        </div>
                    </div>
                </div>
                <div className="cadre-droite-max">
                    <div className="cadre-menu">
                        <div className="cadre-menu-div">
                            <ul className="menu-fixe">
                                <a href="#dungeons"><li><span className="btn-menu">Dungeons</span></li></a>
                                <a href="#personnage"><li><span className="btn-menu">Personnage</span></li></a>
                                <a href="#skill"><li><span className="btn-menu">Compétences</span></li></a>
                                <a href="#option"><li><span className="btn-menu">Options</span></li></a>
                            </ul>
                        </div>
                    </div>
                    <div className="cadre-droite-bas">
                        <div className="cmenu cadre-dungeons">
                            <a name="dungeons" id="dungeons"></a>

                            {!loaded ?
                                <Loading />
                                : viewer ?
                                    dungeonActive?
                                        verifloaded && wdmap
                                        :
                                        dungeons ?
                                            dungeons.map(dungeon =>
                                                <Dungeon key={dungeon.id} dungeon={dungeon}/>
                                            )
                                            : <Text>Il n'y a pas encore de donjons.</Text>
                                    : <Text>Veuillez vous connecter</Text>
                            }
                        </div>
                        <div className="cmenu cadre-perso">
                            <a name="personnage" id="personnage"></a>
                            Perso
                        </div>
                        <div className="cmenu cadre-competence"><a name="skill" id="skill"></a>Competence</div>
                        <div className="cmenu cadre-option">
                            <a name="option" id="option"></a>
                          <h2 style={{textAlign: 'center'}}>Options</h2>
                            <div>
                              <a className="btn-option-editeur" href={window.location.origin + '/editor'}>
                                <span>Editeur</span>
                              </a>
                            </div>
                            <SignOut/>
                        </div>
                    </div>
                </div>
                <div className="cadre-bas-max">
                    <div>
                        <div className="infobar-mana">
                            <div className="infobar-mana-div " dangerouslySetInnerHTML={{__html: energybar  }}>
                            </div>
                        </div>
                        <div className="infobar-life">
                            <div className="infobar-life-div " dangerouslySetInnerHTML={{__html: healthbar }}>
                            </div>
                        </div>
                    </div>
                    <div className="infobar">
                        <div>
                            <div className="infobar-experience">
                                <span> XP : {experience} / {maxexperience}</span>
                            </div>
                            <div className="infobar-experience-progress">
                                <progress className="progressMore" max={maxexperience} value={experience}></progress>
                            </div>
                        </div>
                        <div className="infobar-spell-number">
                                {skills_list}
                        </div>
                    </div>
                </div>
            </View>
        </View>
    );
};

Dungeons.propTypes = {
    dungeons: React.PropTypes.object,
    loaded: React.PropTypes.bool.isRequired,
    loadWorldMap : React.PropTypes.func.isRequired,
    LoadViewer : React.PropTypes.func.isRequired,
    LoadNextStep : React.PropTypes.func.isRequired,
    LoadStep : React.PropTypes.func.isRequired,
    preLoadActiveDungeon : React.PropTypes.func.isRequired,
    viewer: React.PropTypes.object,
    verifloaded: React.PropTypes.number,
    tutoriel: React.PropTypes.object,
    dviewer: React.PropTypes.object,
    dungeonsOP: React.PropTypes.object,
};

Dungeons = firebase((database, props) => {
    const DungeonsRef = database.child('dungeons');
    const ViewerRef = database.child('users/'+props.viewer.id);
    const TutoRef = database.child('tutoriel/'+props.viewer.id);
    let WorldMapRef = database.child('activeDungeons');
    if(props.viewer.id)
    {
        WorldMapRef = database.child('activeDungeons/'+props.viewer.id);
    }
    return [
        [DungeonsRef, 'on', 'value', props.LoadDungeons],
        [WorldMapRef, 'off', 'value', props.ReloadWorldMap],
        [ViewerRef, 'on', 'value', props.LoadViewerRef],
        [TutoRef, 'on', 'value', props.LoadTutoRef],
    ];
})(Dungeons);

export default connect(state => ({
    dungeons: state.dungeons.dungeonLoaded,
    dungeonsOP: state.dungeons.dungeonsOP,
    loaded: state.dungeons.loaded,
    tutoriel: state.dungeons.tutoriel,
    verifloaded: state.dungeons.verifloaded,
    viewer: state.users.viewer,
    dviewer: state.dungeons.viewer,
}), { LoadDungeons,LoadSkills, LoadWeapons,CanUseSkill, preLoadActiveDungeon,cancelDungeon, loadWorldMap,LoadViewer, ReloadWorldMap ,LoadTutoRef,LoadNextStep,LoadViewerRef,LoadStep})(Dungeons);
