import React from 'react';

import { StyledStage } from './styles/StyledStage';
import Cell from './Cell';

const Stage = ({ stage }) => (
    <StyledStage width={stage[0].length} height={stage.length}>
        {stage.map(row => row.map((cell, x) => <Cell key={x} type={cell[0]} />))}
    </StyledStage>
);

/*const nextTetro = ({ nexttetro }) => (
    
    <StyledStage width={nexttetro[0].length} height={nexttetro.length - 11} >
        {nexttetro.map(row => row.map((cell, x) => <Cell key={x} type={cell[0]} /> ))}
    </StyledStage>
)*/

export default Stage;
