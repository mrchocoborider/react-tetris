import { useState, useEffect } from 'react';
import { createStage } from '../gameHelpers';

export const useStage = (player, resetPlayer) => {
    const [stage, setStage] = useState(createStage());
    const [rowsCleared, setRowsCleared] = useState(0);

    useEffect(() => {
        setRowsCleared(0);

        const sweepRows = newStage => 
            newStage.reduce((acc, row) => {
                // so if the row is full, it unshifts a blank row to acc
                // otherwise it will push the row unchanged to acc...
                if (row.findIndex(cell => cell[0] === 0) === -1) {
                    setRowsCleared(prev => prev + 1);

                    
                    
                    

                    //I guess we can understand this as essentially skipping over the current row
                    //since it's not added to the accumulator, the new stage will not have it.
                    //Otherwise, the row is pushed to the accumulator as is. 
                    //acc.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    //acc.push(row.map(cell => cell[1] == 'clear' ? ['W', 'merged'] : ['W', 'merged']));
                    acc.push(row.map(cell => ['W', 'merged']));
                    return acc;    
                    
                }
                
                acc.push(row);
                return acc;
                
                
            }, [])

        const sweepRows2 = newStage => 
            newStage.reduce((acc, row) => {
                // so if the row is full, it unshifts a blank row to acc
                // otherwise it will push the row unchanged to acc...
                if (row.findIndex(cell => cell[0] === 0) === -1) {
                    setRowsCleared(prev => prev + 1);

                    //put color changing code here? No, because it doesn't get added in at all
                    //row.map(cell => cell['W', 'merged']);
                    

                    //I guess we can understand this as essentially skipping over the current row
                    //since it's not added to the accumulator, the new stage will not have it.
                    //Otherwise, the row is pushed to the accumulator as is. 
                    acc.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    return acc;    
                    
                }
                
                acc.push(row);
                console.log('acc3: ' + acc);
                return acc;
                
                
            }, [])
        


        const updateStage = prevStage => {
            // First flush the stage
            const newStage = prevStage.map(row => 
                
                row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))
                //row.map(cell => (cell[1] === 'clear' ? ['W', 'merged'] : cell))
                
                );

            newStage.forEach(row => {
                if (row.findIndex(cell => cell[0] === 0) === -1) {
                    row.map(cell => cell.color = (255, 255, 255 ));
                }
            });

            //newStage[1].map(cell => cell[1] == 'clear' ? ['W', 'merged'] : ['W', 'merged']);

            
            

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
                resetPlayer();
                return sweepRows(newStage);
            }

            return newStage;
        };

        setStage(prev => updateStage(prev))

    }, [player, resetPlayer, rowsCleared]);

    return [stage, setStage, rowsCleared];
}
