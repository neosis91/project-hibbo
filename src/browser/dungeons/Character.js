/**
 * Created by Fakebounce on 13/11/2016.
 */
import React from 'react';
import { connect } from 'react-redux';
import { Image, Flex } from '../app/components';
import { attackMonster,canAttackMonster,moveCharacter,MonsterTurn } from '../../common/dungeons/actions';

type Props = {
    character: Object,
    dungeon: Object,
    row: Object,
    col: Object,
    move: String
};

const Character = ({ character,dungeon,row,col,move, attackMonster,canAttackMonster,moveCharacter,MonsterTurn }: Props) => {
    const styles = {
        margin: '0px 0px 0px 0px'
    };
    let classes= "monster";
    const getPromise = async () => {
        try {
            return await MonsterTurn(dungeon,true);
        }
        catch (error) {
            console.log('An error occured. We could not load the dungeon. Try again later.');
            throw error;
        }
    };
    const getPromiseMove = async () => {
        try {
            return await MonsterTurn(dungeon,false,true);
        }
        catch (error) {
            console.log('An error occured. We could not load the dungeon. Try again later.');
            throw error;
        }
    };
    if(character.is_attacking && character.type == "pj")
    {
        var gif = character.name+'-'+character.direction;
        classes= "monster a"+gif;
        character.image = "/assets/images/classes/"+character.name+"/anime/a"+character.direction+".gif";
        setTimeout(function(){
            character.image = "/assets/images/classes/"+character.name+"/"+character.direction+".png";
            attackMonster(dungeon,character,character.attacking_row,character.attacking_col);
        },1000);
    }
    if(character.is_attacking && character.type == "pnj" && dungeon.monster_turn && dungeon.end_turn)
    {
        classes= "monster monster_a"+character.direction;
        setTimeout(function(){
                getPromise().then(
                    response => console.log('response',response.component.direction),
                    error => console.log('error:',error)
                );
        },1000);
    }
    if(character.is_moving && character.type == "pnj")
    {
        classes= "monster Warrior-"+character.direction;
        setTimeout(function(){
            getPromiseMove().then(
                response => console.log('response',response.component.direction),
                error => console.log('error:',error)
            );
        },1000);
    }
    if(move && character.type == "pj")
    {

        var gif = character.name+'-'+move;
        classes= "monster "+gif;
        character.image = "/assets/images/classes/"+character.name+"/anime/"+move+".gif";
        setTimeout(function(){
            character.image = "/assets/images/classes/"+character.name+"/"+move+".png";
            moveCharacter(dungeon,row,col);
        },1000);
    }
    if(character.is_attacked && character.type == "pj")
    {
        var opposed_img = '';
        if(character.attacked_direction == "left")
        {
            opposed_img = 'right';
        }
        if(character.attacked_direction == "right")
        {
            opposed_img = 'left';
        }
        if(character.attacked_direction == "up")
        {
            opposed_img = 'down';
        }
        if(character.attacked_direction == "down")
        {
            opposed_img = 'up';
        }
        classes= classes+" attacked_"+character.attacked_direction;
        character.image = "/assets/images/classes/"+character.name+"/anime/"+opposed_img+".gif";
        setTimeout(function(){
            character.image = "/assets/images/classes/"+character.name+"/"+opposed_img+".png";
        },1000);
    }
    if(character.is_attacked && character.type == "pnj")
    {
        classes= classes+" attacked_"+character.attacked_direction;
    }
    const attack_a_monster = function(){
        if(character.type == "pnj")
        {
            canAttackMonster(dungeon,character,row,col);
        }
    };
    return (
            <Image className={classes} onClick={attack_a_monster} src={character.image} style={styles}/>
    );
};

Character.propTypes = {
    character: React.PropTypes.object.isRequired,
    attackMonster: React.PropTypes.func.isRequired,
    moveCharacter: React.PropTypes.func.isRequired
};

export default connect(state => ({
    dungeonsOP: state.dungeons.dungeonsOP,
}), { attackMonster,canAttackMonster,moveCharacter,MonsterTurn }) (Character);


