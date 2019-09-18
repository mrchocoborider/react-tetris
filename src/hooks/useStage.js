import { useState, useEffect } from 'react';
import { createStage } from '../gameHelpers';
import ReactTimeout from 'react-timeout'

//testing flash effect
//import { useTimeout } from '../hooks/useTimeout';

export const useStage = (player, resetPlayer, tetro, resetTetro, next) => {
    const [stage, setStage] = useState(createStage());
    const [rowsCleared, setRowsCleared] = useState(0);
    //testing flash effect
    const [test, setTest] = useState(0);
    //let test = 0;
    
    useEffect(() => {
        setRowsCleared(0);
        //console.log('how often do I get called, and when?')

        const sweepRows = newStage => 
            newStage.reduce((acc, row) => {
                
                
                // tried to make a flash effect but it's not worth the trouble lol
                if (row.findIndex(cell => cell[0] === 0) === -1 
                && row.every(cell => cell[0] !== 'W' ) ) {
                    //setRowsCleared(prev => prev + 1);
                    setTest(1);
                    console.log('test: ');
                    console.log(test);
                    console.log('^-- flash white');
                    acc.push(row.map(() => ['W', 'merged']));
                    return acc;    
                    
                } else if (row.every(cell => cell[0] === 'W')) {

                    setRowsCleared(prev => prev + 1);

                    //test = 0;
                    console.log('unshift');
                    

                  
                    acc.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    
                    //acc.push(row.map(cell => ['W', 'merged']));
                    return acc;  
                }                    
                /*if (row.findIndex(cell => cell[0] === 0) === -1){
                    setRowsCleared(prev => prev + 1);

                    
                    
                    

                  
                    acc.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    
                    //acc.push(row.map(cell => ['W', 'merged']));
                    return acc;    
                    
                }*/
                
                acc.push(row);
                return acc;
                
                
            }, [])

        
        


        const updateStage = prevStage => {
            // First flush the stage
            
            const newStage = prevStage.map(row => 
                
                row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))
                //row.map(cell => (cell[1] === 'clear' ? ['W', 'merged'] : cell))
                
                );

                

            
            

            // Then draw the tetromino
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        newStage[y + player.pos.y][x + player.pos.x] = [
                            value,
                            `${player.collided ? 'merged' : 'clear'}`
                        ];
                    }
                });
            });


            

            // Then check if we collided
            if (player.collided) {
                //if (test == 1){
                console.log("here?")
                resetTetro(next);
                resetPlayer(tetro);
               // }
                return sweepRows(newStage);
                
                //return sweepRows(newStage);
            }

            /*if (test == 1 && !player.collided){
                //resetTetro(next);
                //resetPlayer(tetro);
                console.log('made it here too');
                setTest(0);
                
                
                return sweepRows(newStage);
                
            }*/
            if (test == 1){
                //resetTetro(next);
                //resetPlayer(tetro);
                //console.log('made it here too');
                setTest(2);
                
                
                //return sweepRows(newStage);
                
            }
            if (test == 2){
                setTest(0);

                return sweepRows(newStage);
            }
            
            
            return newStage;
        };
        //console.log('test2: ' + test);
        //console.log('how often do I get called, and when?');
        setStage(prev => updateStage(prev))
        /*if (test == 1){
            console.log("it made it here");
            setTest(0);
             
            
        }*/

    }, [player, resetPlayer, resetTetro, rowsCleared]);

    //return [stage, setStage, rowsCleared];
    return [stage, setStage, rowsCleared];
}
