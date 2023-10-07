import styled from "styled-components"
import { Cursor } from "@react95/core";

import styles from "../modals/css/Blackjack.module.css"

const CursorItem = styled.div`
  ${({ type }) => Cursor[type]};
  margin-left: 2px;
  margin-right: 2px;
`;

const Card = ({
    value,
    suit,
    hidden
}) => {

    let className = styles['card'];

    switch (value) {
        case "2":
            className += ` ${styles['two']}`
            break
        case "3":
            className += ` ${styles['three']}`
            break
        case "4":
            className += ` ${styles['four']}`
            break
        case "5":
            className += ` ${styles['five']}`
            break
        case "6":
            className += ` ${styles['six']}`
            break
        case "7":
            className += ` ${styles['seven']}`
            break
        case "8":
            className += ` ${styles['eight']}`
            break
        case "9":
            className += ` ${styles['nine']}`
            break
        case "10":
            className += ` ${styles['ten']}`
            break
        case "A":
            className += ` ${styles['ace']}`
            break
        case "J":
            className += ` ${styles['jack']}`
            break
        case "Q":
            className += ` ${styles['queen']}`
            break
        case "K":
            className += ` ${styles['king']}`
            break
        default:
            className += ` `
    }

    switch (suit) {
        case "clubs":
            className += ` ${styles['clubs']}`
            break
        case "diamonds":
            className += ` ${styles['diamonds']}`
            break
        case "spades":
            className += ` ${styles['spades']}`
            break
        default:
            className += ` ${styles['hearts']}`

    }

    return (
        <CursorItem type={"Auto"} className={className}>

        </CursorItem>
    )
}

export default Card