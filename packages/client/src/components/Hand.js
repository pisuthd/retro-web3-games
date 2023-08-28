import styled from 'styled-components'
import Card from './Card'

const Container = styled.div`
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    top: ${props => !props.firstRow ? "53%" : "25%"};
    display: flex;
    flex-direction: row;
`

const Hand = ({
    game,
    side
}) => {

    let cards

    if (game) {
        switch (side) {
            case "Dealer":
                cards = game.dealerCards
                break
            case "Player":
                cards = game.userCards
                break
            default:
                cards = [{ hidden: true }, { hidden: true }]
        }
    } else {
        cards = [{ hidden: true }, { hidden: true }]
    }


    return (
        <Container firstRow={side === "Dealer"}>
            {cards.map((card, index) => {
                return (
                    <Card key={index} value={card.value} suit={card.suit} hidden={card.hidden} />
                );
            })}
        </Container>
    )
}

export default Hand