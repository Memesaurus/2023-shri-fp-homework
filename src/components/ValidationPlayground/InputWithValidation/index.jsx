import React, {useState, useEffect, useRef} from 'react';
import cn from 'classnames';

import {SHAPES, COLORS} from '../../../constants';
import styles from './styles.module.css';

const getShapesClassName = isFieldValid => cn(styles.shapes, {
    [styles.shapesUntouched]: isFieldValid === undefined,
    [styles.shapesValid]: isFieldValid === true,
    [styles.shapesInvalid]: isFieldValid === false,
});

const getShapeClassName = shapeColor => cn({
    [styles.shapeColorWite]: shapeColor === COLORS.WHITE,
    [styles.shapeColorRed]: shapeColor === COLORS.RED,
    [styles.shapeColorOrange]: shapeColor === COLORS.ORANGE,
    [styles.shapeColorGreen]: shapeColor === COLORS.GREEN,
    [styles.shapeColorBlue]: shapeColor === COLORS.BLUE,
}, styles.shape);

const pickNextColor = color => {
    switch(color) {
        case COLORS.WHITE: return COLORS.RED;
        case COLORS.RED: return COLORS.ORANGE;
        case COLORS.ORANGE: return COLORS.GREEN;
        case COLORS.GREEN: return COLORS.BLUE;
        case COLORS.BLUE: return COLORS.RED;
        default: return COLORS.WHITE;
    }
}

const InputWithValidation = ({validateFn, label}) => {
    const [isFieldValid, setIsFieldValid] = useState(undefined);

    const [
        colors,
        updateColors,
    ] = useState({circle: COLORS.WHITE, square: COLORS.WHITE, triangle: COLORS.WHITE, star: COLORS.WHITE});

    const {
        circle,
        square,
        triangle,
        star,
    } = colors;

    const loaded = useRef(false);

    useEffect(() => {
        if (loaded.current) {
            if (Object.values(colors).every(el => el === COLORS.WHITE)) {
                setIsFieldValid(undefined);
            } else {
                console.log(validateFn(colors));
                if (validateFn(colors)) {
                    if (!isFieldValid) {
                        setIsFieldValid(true)
                    }
                } else {
                    setIsFieldValid(false);
                }
            }
        } else {
            loaded.current = true;
        }
    }, [colors, isFieldValid, validateFn]);

    const processClick = shape => event => {
        const currentColor = colors[shape];

        updateColors({
            ...colors,
            [shape]: pickNextColor(currentColor),
        });
    }
    
    const unsetColor = shape => event => {
        updateColors({
            ...colors,
            [shape]: COLORS.WHITE,
        });
    }

    return (
        <div className={styles.root}>
            <div>{label}</div>

            <div className={getShapesClassName(isFieldValid)}>
                <svg>
                    <circle
                        className={getShapeClassName(circle)}
                        onClick={processClick(SHAPES.CIRCLE)}
                        onDoubleClick={unsetColor(SHAPES.CIRCLE)}
                        onAuxClick={unsetColor(SHAPES.CIRCLE)}
                        cx="21"
                        cy="24"
                        r="20"
                        stroke="dimgray" 
                        strokeWidth="2"
                    />

                    <rect 
                        className={getShapeClassName(square)}
                        onClick={processClick(SHAPES.SQUARE)}
                        onDoubleClick={unsetColor(SHAPES.SQUARE)}
                        onAuxClick={unsetColor(SHAPES.SQUARE)}
                        x="50" 
                        y="5" 
                        width="39" 
                        height="39" 
                        rx="5" 
                        ry="5" 
                        strokeWidth="2"
                    />

                    <path 
                        className={getShapeClassName(triangle)}
                        onClick={processClick(SHAPES.TRIANGLE)}
                        onDoubleClick={unsetColor(SHAPES.TRIANGLE)}
                        onAuxClick={unsetColor(SHAPES.TRIANGLE)}
                        d="M118 3 L138 43 L98 43 Z" 
                        stroke="dimgray" 
                        strokeWidth="2"
                    />

                    <polygon 
                        className={getShapeClassName(star)}
                        onClick={processClick(SHAPES.STAR)}
                        onDoubleClick={unsetColor(SHAPES.STAR)}
                        onAuxClick={unsetColor(SHAPES.STAR)}
                        points="165 0 170 20 185 20 175 30 180 45 165 35 150 45 155 30 145 20 160 20"
                        stroke="dimgray" 
                        strokeWidth="2"
                    />
                </svg>
            </div>
        </div>
    )
}


export default InputWithValidation;
