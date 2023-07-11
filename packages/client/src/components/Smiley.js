import styles from "../modals/css/Minesweeper.module.css"

const stateToClassName = {
    'NORMAL': '',
    'LOSE': styles['lose'],
    'SCARED': styles['scared'],
    'WIN': styles['win']
}

function Smiley({
    state,
    onClick
}) {
    const className = `${styles['smiley']} ${stateToClassName[state]}`;

    return <div className={className} onClick={onClick} />
}

export default Smiley;