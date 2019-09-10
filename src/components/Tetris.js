import React, { useState } from 'react';


import { createStage, checkCollision } from '../gameHelpers';

// Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
import PauseButton from './PauseButton';

//Styled Components
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris'


//Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';
//import { clone } from '@babel/types';


// Components
const Tetris = () => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [paused, setPaused] = useState(false);
    const [buttText, setButtText] = useState("Pause Game");
    const [startText, setStartText] = useState("Start Game");

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    //const [stage, setStage] = useStage(player, resetPlayer);
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
        rowsCleared
    );



    //console.log('re-render');

    const movePlayer = dir => {
        if (!checkCollision(player, stage, {x: dir, y: 0 })){
            updatePlayerPos({ x: dir, y: 0})
        }
        
    }

    const startGame = () => {
        // Reset everything
        setStage(createStage());
        setPaused(false);
        resetPlayer();
        setDropTime(1000);
        setGameOver(false);
        setScore(0);
        setRows(0);
        setLevel(0);
        setStartText("Restart Game");
    }

    const pauseGame = () => {
        if (paused !== true) {
            setDropTime(null);
            setPaused(true);
            setButtText("Unpause Game");
        } else if (paused === true) {
            setDropTime(1000 / (level + 1) + 200);
            setPaused(false);
            setButtText("Pause Game");
        }
    }

    const drop = () => {
        //Increase level when player has cleared 10 rows
        if (rows > (level + 1) * 10) {
            setLevel(prev => prev + 1);
            // Also increase speed
            setDropTime(1000 / (level + 1) + 200);
        }

        if (!checkCollision(player, stage, { x: 0, y: 1})){
            updatePlayerPos({ x: 0, y: 1, collided: false});
            console.log('testing deploying');
            //flash effect test
            //updatePlayerPos({ x: 0, y: 0, collided: 'test'});
            
            
        } else {
            // GameOver
            
            if (player.pos.y < 1){
                console.log("GAME OVER!!!");
                setStartText("Start Game");
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({ x: 0, y: 0, collided: true});
            
            
        }
        
    }


    const keyUp = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === 40 || keyCode === 32) {
                console.log("Interval on");
                setDropTime(1000 / (level + 1) + 200);
            }
        }
    }

    const dropPlayer = () => {
        console.log("Interval off");
        setDropTime(null);
        drop();
    }

    //drop to bottom
    //TODO: figure out why it errors out when I move the tetromino closer to the bottom
    //or closer to already merged tetrominos.
    const fastDrop = () => {
        console.log("Interval off");
        setDropTime(null);
        let cy = player.pos.y;

        if (checkCollision(player, stage, {x: 0, y:1})){
            console.log("GAME OVER!!!");
            setGameOver(true);
            setStartText("Start Game");
            setDropTime(null);
        }
        
        while(!checkCollision(player, stage, { x: 0, y: cy })){
            cy += 1
        }
        
        cy -= 1;
        console.log(cy);
        updatePlayerPos({ x: 0, y: cy, collided: true});
        //updatePlayerPos({ x: 0, y: cy, collided: false});
 
    }



    const move = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === 37) {
                movePlayer(-1)
            } else if (keyCode === 39) {
                movePlayer(1);
            } else if(keyCode === 40) {
                dropPlayer();
            } else if (keyCode === 38) {
                playerRotate(stage, 1);
            } else if (keyCode === 32) {
                fastDrop();
            }

        }
    }

    useInterval(() => {
        drop();
    }, dropTime)

    /*<Display text={`Next: ${nexttetromino}`} />*/
    return (
    <StyledTetrisWrapper 
        role="button" 
        tabIndex="0" 
        onKeyDown={e => move(e)} 
        onKeyUp={keyUp}
    >
        <StyledTetris>
            <Stage stage={stage} />
            <aside>
                {gameOver ? (
                    <Display gameOver ={gameOver} text="Game Over" />
                ) : (
                <div>
                    
                    <Display text={`Score: ${score}`} />
                    <Display text={`Rows: ${rows}`} />
                    <Display text={`Level: ${level}`} />
                </div>
                )}
                <StartButton callback={startGame} text={startText} />
                <PauseButton callback={pauseGame} text={buttText} />
            </aside>
        </StyledTetris>
    </StyledTetrisWrapper>
    )
}

export default Tetris;
