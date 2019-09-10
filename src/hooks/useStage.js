import { useState, useEffect } from 'react';
import { createStage } from '../gameHelpers';

export const useStage = (player, resetPlayer) => {
    const [stage, setStage] = useState(createStage());
    const [rowsCleared, setRowsCleared] = useState(0);

    useEffect(() => {
        setRowsCleared(0);
        //console.log('how often do I get called, and when?')

        const sweepRows = newStage => 
            newStage.reduce((acc, row) => {
                // tried to make a flash effect but it's not worth the trouble lol
                /*if (row.findIndex(cell => cell[0] === 0) === -1 
                && row.every(cell => cell[0] !== 'W' ) ) {
                    setRowsCleared(prev => prev + 1);

                    
                    acc.push(row.map(cell => ['W', 'merged']));
                    return acc;    
                    
                } else if
                if (row.every(cell => cell[0] === 'W')) {*/
                if (row.findIndex(cell => cell[0] === 0) === -1){
                    setRowsCleared(prev => prev + 1);

                    
                    
                    

                    //I guess we can understand this as essentially skipping over the current row
                    //since it's not added to the accumulator, the new stage will not have it.
                    //Otherwise, the row is pushed to the accumulator as is. 
                    acc.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    
                    //acc.push(row.map(cell => ['W', 'merged']));
                    return acc;    
                    
                }
                
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
                        console.log('x, y: ' + x + ' ' + y);
                        console.log(player);
                        newStage[y + player.pos.y][x + player.pos.x] = [
                            value,
                            `${player.collided ? 'merged' : 'clear'}`
                        ];
                    }
                });
            });
            // Then check if we collided
            if (player.collided) {
                resetPlayer();
                return sweepRows(newStage);
            }
            /*
            part of flash effect testing
            if ( player.collided === 'test'){
                return sweepRows(newStage);
            }
            */
            
            return newStage;
        };

        setStage(prev => updateStage(prev))

    }, [player, resetPlayer, rowsCleared]);

    return [stage, setStage, rowsCleared];
}
