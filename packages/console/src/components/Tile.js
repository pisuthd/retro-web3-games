import { useCallback, useContext, useState } from "react";
import styles from "../modals/css/Minesweeper.module.css"
import { MinesweeperContext } from "../hooks/useMinesweeper";
import { Cursor } from "@react95/core";
import styled from "styled-components"

const mineCountToClassName = [
    styles['empty'],
    styles['one'],
    styles['two'],
    styles['three'],
    styles['four'],
    styles['five'],
    styles['six'],
    styles['seven'],
    styles['eight']
];

const CursorItem = styled.div`
  ${({ type }) => Cursor[type]};
`;

const Tile = ({
    tile,
    gameEnded,
    processing,
    coordinates,
    key,
    handleClick
}) => {

    let className = styles['tile'];

    switch (tile) {
        case "blank":
            break
        case "pressed":
            className += ` ${styles['question']}`;
            break;
        case "open0":
            className += ` ${styles['empty']}`;
            break;
        case "open1":
            className += ` ${styles['one']}`;
            break;
        case "open2":
            className += ` ${styles['two']}`;
            break;
        case "open3":
            className += ` ${styles['three']}`;
            break;
        case "open4":
            className += ` ${styles['four']}`;
            break;
        case "open5":
            className += ` ${styles['five']}`;
            break;
        case "open6":
            className += ` ${styles['six']}`;
            break;
        case "open7":
            className += ` ${styles['seven']}`;
            break;
        case "open8":
            className += ` ${styles['eight']}`;
            break;
        case "bombrevealed":
            className += ` ${styles['mine']}`;
            break;
        case "bombdeath":
            className += ` ${styles['mine']} ${styles['caused-game-end']}`;
            break;
        case "bombflagged":
            className += ` ${styles['flagged']}`;
            break;
        default:
            break;
    }

    if (tile === "blank") {
        return (
            <CursorItem
                key={key}
                type={processing ? "Progress" : "Auto"}
                className={className}
                onClick={(e) => gameEnded || handleClick(e, coordinates)}
                onContextMenu={(e) => {
                    if (!gameEnded) {
                        e.preventDefault();
                        handleClick(e, coordinates, true)
                    }
                }}
            >

            </CursorItem>
        )
    } else {
        className += ` ${styles['revealed']}`;
        return (
            <CursorItem key={key} type={processing ? "Progress" : "Auto"} className={className}></CursorItem>
        )
    }
}


export default Tile