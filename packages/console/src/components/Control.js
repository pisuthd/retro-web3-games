import styled from "styled-components"
import { Cursor, Button } from "@react95/core";
import { Progman42 } from "@react95/icons"

const Container = styled.div`
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    bottom: 20px; 
    text-align: center;
    color: white;
    text-shadow: black 1px 2px;
    font-size: 14px;
`

const StyledButton = styled(Button)` 
    cursor: pointer;
    margin: 10px;
    margin-left: 3px;
    margin-right: 3px;
    img, h3 {
        cursor: pointer;
    }
`

const Control = ({
    game,
    onDeal,
    onAction
}) => {
    return (
        <Container>
            {/* {game && game.state !== "userTurn" && <h1>{game.state}</h1>} */}
            {game && game.state === "userTurn" && <>Your Score: {game.userScore}</>}
            {(game && game.state === "userTurn") && <>
                <div>
                    <StyledButton onClick={() => onAction(0)}>
                        ✋{` `}
                        Hit
                    </StyledButton>
                    <StyledButton onClick={() => onAction(1)}>
                        👌{` `}
                        Stand
                    </StyledButton>
                </div>
            </>}
            {(!game || game.state !== "userTurn") && <div>
                {!game && "Start Game With"}
                {game && game.state !== "userTurn" && "New Game With"}
                <div>
                    <StyledButton onClick={() => onDeal(10)}>
                        <img
                            src={"/coin-icon.png"}
                            height={10}
                            width={10}
                            style={{ marginRight: 5 }}
                        />
                        10
                    </StyledButton>
                    <StyledButton onClick={() => onDeal(20)}>
                        <img
                            src={"/coin-icon.png"}
                            height={10}
                            width={10}
                            style={{ marginRight: 5 }}
                        />
                        20
                    </StyledButton>
                    <StyledButton onClick={() => onDeal(50)}>
                        <img
                            src={"/coin-icon.png"}
                            height={10}
                            width={10}
                            style={{ marginRight: 5 }}
                        />
                        50
                    </StyledButton>
                    <StyledButton onClick={() => onDeal(100)}>
                        <img
                            src={"/coin-icon.png"}
                            height={10}
                            width={10}
                            style={{ marginRight: 5 }}
                        />
                        100
                    </StyledButton>
                </div>
            </div>}
        </Container>
    )
}

export default Control