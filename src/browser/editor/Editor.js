/**
 * Created by Fakebounce on 13/11/2016.
 */

import React from 'react';
import WorldMap from './WorldMap';
import EditorMap from './EditorMap';
import EditMonster from './EditMonster';
import EditTile from './EditTile';
import SignOut from '../auth/SignOut';
import { Block, View, Text, Image,Loading } from '../app/components';
import { connect } from 'react-redux';
import { firebase } from '../../common/lib/redux-firebase';
import { LoadMaps,LoadMapTiles,picktile,pickmonster,loadWorldMap,LoadViewer,LoadMapActive,ReloadActiveMap,LoadMonsters } from '../../common/editor/actions';



let Editor = ({worldmaps, picktile,pickmonster, viewer,dviewer, loaded, loadWorldMap, LoadViewer,activeMap,LoadMapActive,maptiles,monsters }) => {

    const styles = {
        bg: {
            backgroundImage: "",
        }
    };
    let listmaptiles = [];
    let listmonsters = [];
    let viewmonster = false;

    let activeTile = false;
    let activeMonster = false;


    if (monsters) {
        console.log('monster');
        monsters.map(listm => {

            if (activeMonster) {
                if (listm.id == activeMonster.id) {
                    listmonsters.push(<EditMonster key={listm.id} monster={listm} active="active"/>);
                }
                else {
                    listmonsters.push(<EditMonster key={listm.id} monster={listm}/>);
                }
            } else {
                listmonsters.push(<EditMonster key={listm.id} monster={listm} />);
            }
        });
    }
    else
    {
        if(maptiles)
        {

            console.log('maptiles');
            maptiles.map(list => {
                if (activeTile) {
                    if (list.id == activeTile.id) {
                        listmaptiles.push(<EditTile key={list.id} maptile={list} picktile={picktile} active="active"/>);
                    }
                    else {
                        listmaptiles.push(<EditTile key={list.id} maptile={list} picktile={picktile}/>);
                    }
                } else {
                    listmaptiles.push(<EditTile key={list.id} maptile={list} picktile={picktile}/>);
                }
            });
        }
    }

    if(!dviewer)
    {
        LoadViewer(viewer);
    }else
    {
        if(activeMap){

            var wdmap = [];
            var mapactive = false;
            let mapViewer;
            activeMap.map(activeMap => mapViewer = activeMap);

            if(mapViewer)
            {
                mapactive = true;
                if(viewer)
                {
                    wdmap.push(<EditorMap key={mapViewer.id} worldmap={mapViewer} viewer={viewer} maptiles={maptiles} monsters={monsters}/>);
                }
            }
        }
        else
        {
            if(viewer && !viewer.active_map)
            {
                LoadMapActive(viewer);
            }
            mapactive =false;
        }

    }

    console.log("listmaptiles",listmaptiles);
    return (
    <View className="">
        <View className="container_editor_app-img"></View>
        <View className="container_app-editor">


        <div className="cadre-menu-editor">
            <div className="cadre-menu-div-editor">
                <ul className="menu-fixe-editor">
                    <a href="#dungeons"><li><span className="btn-menu">Dungeons</span></li></a>
                    <a href="#option"><li><span className="btn-menu">Options</span></li></a>
                 </ul>
            </div>
        </div>
        <div className="cadre-editor">
            <div className="cmenu-editor">
                    {!loaded ?
                        <Loading />
                        : viewer ?
                            mapactive?
                                wdmap
                                :
                                worldmaps ?
                                    worldmaps.map(activeMap =>
                                        <WorldMap key={activeMap.id} worldmap={activeMap} viewer={viewer} loadWorldMap={loadWorldMap}/>

                            )

                            : <Text>Il n'y a pas encore de map.</Text>
                        : <Text>Aucun utilisateur</Text>
                    }
            </div>

        </div>


        </View>

    </View>
    );
};

Editor = firebase((database, props) => {
    const EditorRef = database.child('maps');
    const MapActiveRef = database.child('activeMap');
    let WorldMapRef = database.child('activeMap');
    let MonsterRef = database.child('monsters');
    if(props.viewer)
    {

        WorldMapRef = database.child('activeMap/'+props.viewer.id);
    }
    const TileRef = database.child('maptiles');
    return [
        [EditorRef, 'on', 'value', props.LoadMaps],
        [TileRef, 'on', 'value', props.LoadMapTiles],
        [MapActiveRef, 'on', 'value', props.LoadMapActive],
        [WorldMapRef, 'on', 'value', props.ReloadActiveMap],
        [MonsterRef, 'on', 'value', props.LoadMonsters],
    ];
})(Editor);

Editor.propTypes = {
    loaded: React.PropTypes.bool.isRequired,
    worldmaps : React.PropTypes.object,
    maptiles : React.PropTypes.object,
    viewer: React.PropTypes.object,
    dviewer : React.PropTypes.object,
    loadWorldMap : React.PropTypes.func,
    activeMap : React.PropTypes.object,
    monsters : React.PropTypes.object,
};


export default connect(state => ({
    loaded: state.editor.loaded,
    viewer: state.users.viewer,
    worldmaps: state.editor.worldmaps,
    dviewer: state.editor.viewer,
    activeMap: state.editor.activeMap,
    maptiles : state.editor.maptiles,
    monsters : state.editor.monsters,
}), {LoadMaps, LoadMapTiles,loadWorldMap,picktile,pickmonster,LoadViewer,LoadMapActive,ReloadActiveMap,LoadMonsters })(Editor);
