import React, { useContext, useState, useCallback, useEffect } from 'react'
import { Modal, Frame, Avatar, List, ProgressBar, Alert, Button } from '@react95/core'
import styled from 'styled-components'
import { TomoContext } from '../hooks/useTomo'
import { InventoryContext } from '../hooks/useInventory'
import { parseError, randomGreeting, shortAddress } from '../helpers'
import { useWeb3React } from '@web3-react/core'

import { useInterval } from '../hooks/useInterval'
 

const Body = styled.div`
    height: 540px;
    background-image: url('pet-sitter/background.png');
    background-size: cover;
    margin: 0px; 
    position: relative;
`

const StyledButton = styled(Button)` 
    margin: auto;
    ${props => !props.disabled && `
    cursor: pointer; 
    ` }
`

const ItemContainer = styled.div`
    position: absolute;
    bottom: ${props => props.bottom && `${props.bottom}px`};
    left: ${props => props.left && `${props.left}px`};
    -webkit-transform: scaleX(${props => props.scaleX && `${props.scaleX}`});
    transform: scaleX(${props => props.scaleX && `${props.scaleX}`});
    >img {
        cursor:pointer;
    }
`

const SelectedItem = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-direction: row;
`

const MyCollection = styled.div`
    position: absolute;
    bottom: 10px;
    left: 10px;
    display: flex;
    flex-direction: row;
`

const MyCollectionItem = styled(Frame)`
    cursor: pointer; 
    margin-right: 10px;
    ${props => props.selected && `
    background: blue;
    `}
    img {
        
        cursor: pointer;
    }
`

const BubbleContainer = styled.div`

-webkit-transform: scaleX(${props => props.scaleX && `${props.scaleX}`});
transform: scaleX(${props => props.scaleX && `${props.scaleX}`});

/* (A) SPEECH BOX */
.speech {
  /* (A1) FONT */
   font-size: 1.1em;
    text-align: center;
 
  /* (A2) COLORS */
  color: #fff;
  background: #a53d38;
 
  /* (A3) DIMENSIONS + POSITION */
  position: relative;
  padding: 20px;
  border-radius: 10px;
  margin: 20px auto;
  max-width: 320px;
}

/* (B) ADD SPEECH "CALLOUT TAIL" */
/* (B1) USE ::AFTER TO CREATE THE "TAIL" */
.speech::after {
  /* (B1-1) ATTACH TRANSPARENT BORDERS */
  content: "";
  border: 20px solid transparent;
 
  /* (B1-2) NECESSARY TO POSITION THE "TAIL" */
  position: absolute;
}
 
/* (B2) BOTTOM "CALLOUT TAIL" */
.bottom.speech::after {
  /* (B2-1) DOWN TRIANGLE */
  border-top-color: #a53d38;
  border-bottom: 0;
 
  /* (B2-2) POSITION AT BOTTOM */
  bottom: -20px; left: 50%;
  margin-left: -20px;
}

/* (C) DIFFERENT TAIL POSITIONS */
/* (C1) TOP */
.top.speech::after {
  /* (C1-1) UP TRIANGLE */
  border-bottom-color: #a53d38;
  border-top: 0;
 
  /* (C1-2) POSITION AT TOP */
  top: -20px; left: 50%;
  margin-left: -20px;
}
 
/* (C2) LEFT */
.left.speech::after {
  /* (C2-1) LEFT TRIANGLE */
  border-right-color: #a53d38;
  border-left: 0;
 
  /* (C2-2) POSITION AT LEFT */
  left: -20px; top: 50%;
  margin-top: -20px;
}
 
/* (C3) RIGHT */
.right.speech::after {
  /* (C3-1) RIGHT TRIANGLE */
  border-left-color: #a53d38;
  border-right: 0;
 
  /* (C3-2) POSITION AT RIGHT */
  right: -20px; top: 50%;
  margin-top: -20px;
}

/* (X) THE REST DOES NOT MATTER - COSMETICS */
/* PAGE & BODY */
* {
  font-family: arial, sans-serif;
  box-sizing: border-box;
}

/* WIDGET */
.widget-wrap {
  max-width: 500px;
  padding: 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.4);
}

/* SVG */
#talk {
  width: 100%; height:120px;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 512 512" width="100" xmlns="http://www.w3.org/2000/svg"><path d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 9.8 11.2 15.5 19.1 9.7L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64z" /></svg>');
  background-repeat: no-repeat;
  background-position: center;
}

/* FOOTER */
#code-boxx {
  font-weight: 600;
  margin-top: 30px;
}
#code-boxx a {
  display: inline-block;
  padding: 5px;
  text-decoration: none;
  background: #b90a0a;
  color: #fff;
}
`

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

const Item = ({ data, index, length, onClick, randoms, active }) => {

    const { image } = data

    const randomBottom = randoms[index]

    const multiplier = length > 4 ? 125 : 250

    return (
        <>
            <ItemContainer
                onClick={onClick}
                key={index}
                bottom={randomBottom}
                left={index * (multiplier)}
                scaleX={index % 2 == 0 ? 1 : -1}
            >
                {active === index && (
                    <BubbleContainer scaleX={index % 2 == 0 ? 1 : -1}>
                        <div class="speech bottom">
                            {randomGreeting()}
                        </div>
                    </BubbleContainer>
                )}
                <img
                    src={image}
                    height={150}
                    width={150}
                />
            </ItemContainer>
        </>

    )
}

const Info = styled.div` 
    margin-right: 10px;
    margin-bottom: 3px;
`

const LockItem = ({ selected , onUnlock }) => {

    const { account } = useWeb3React()

    const [owner, setOwner] = useState()

    const { checkOwner } = useContext(TomoContext)

    useEffect(() => {
        selected && checkOwner(selected.tokenId).then(setOwner)
    }, [selected])

    return (
        <>
            <Frame h="120" w="300" padding={4} boxShadow="in">
                <Frame h="100%" boxShadow="in" style={{ display: "flex", flexDirection: "row" }}>
                    <img
                        style={{ marginTop: "auto", marginBottom: "auto", marginLeft: "5px" }}
                        src={selected.image}
                        height={"100px"}
                        weight="100px"
                    />
                    <div style={{ display: "flex", flexDirection: "column", marginLeft: "10px" }}>
                        <h4>{selected.name}</h4>
                        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                            <Info>
                                ID: {selected.tokenId}
                            </Info>
                            <Info>
                                Owner: {owner && shortAddress(owner, 5, -3)}
                            </Info>

                        </div>

                    </div>
                </Frame>
            </Frame>
            <div style={{ display: "flex", marginLeft: "10px" }}>
                <StyledButton
                    disabled={owner !== account}
                    onClick={onUnlock}
                >
                    Withdraw
                </StyledButton>
            </div>
        </>
    )
}

const PetSitter = ({ closeModal }) => {

    const { tokens, myColllections, lock, unlock } = useContext(TomoContext)

    const [selectedMyCollection, setSelectedMyCollection] = useState()
    const [selected, setSelected] = useState()
    const [randoms, setRandoms] = useState([])

    const [active, setActive] = useState(-1)

    const [count, setCount] = useState(0)

    useEffect(() => {
        const randoms = tokens.map((item) => {
            return Math.floor(getRandomNumber(60, 200))
        })
        setRandoms(randoms)
    }, [tokens])

    const onLock = useCallback(async () => {
        try {
            const { tokenId } = selectedMyCollection
            await lock(tokenId)
        } catch (e) {
            alert(parseError(e))
        }
    }, [lock, selectedMyCollection])

    const onUnlock = useCallback(async () => {
        try {
            const { tokenId } = selected 
            await unlock(tokenId)
        } catch (e) {
            alert(parseError(e))
        }
    }, [lock, selected])

    useInterval(
        () => {
            const activeIndex = count % (tokens.length + 3)
            setActive(activeIndex)
            setCount(count + 1)

        },
        // Passing in the delay parameter. null stops the counter. 
        3000,
    )

    return (
        <>
            <Modal
                width="950"
                icon={<img
                    src={"/pet-sitter-icon.png"}
                    height={16}
                    width={16}
                />}
                title="Tomo Playground - Where Tomo Pets Socialize"
                closeModal={closeModal}
                defaultPosition={{
                    x: 200,
                    y: 0,
                }}
            >
                <Body>
                    {selected && (
                        <SelectedItem>
                            <LockItem
                                selected={selected}
                                onUnlock={onUnlock}
                            />
                        </SelectedItem>
                    )}
                    {tokens.map((item, index) => {
                        return (
                            <Item
                                data={item}
                                active={active}
                                randoms={randoms}
                                index={index}
                                length={tokens.length}
                                onClick={() => {
                                    setSelected({
                                        ...item,
                                        index
                                    })
                                }}
                            />
                        )
                    })}
                    <MyCollection>
                        {myColllections.length === 0 && (
                            <MyCollectionItem h="80" w="80" padding={4} boxShadow="in">
                                <Frame h="100%" boxShadow="in" style={{ display: "flex", padding: "5px" }}>
                                    <div style={{ margin: "auto", textAlign: "center", fontSize: "11px" }}>
                                        No TomoNFT
                                    </div>
                                </Frame>
                            </MyCollectionItem>
                        )

                        }
                        {myColllections.map((item, index) => {
                            return (
                                <MyCollectionItem h="80" w="80" key={index} padding={4} boxShadow="in" selected={selectedMyCollection && selectedMyCollection.index === index}>
                                    <Frame h="100%" boxShadow="in">
                                        <img
                                            src={item.image}
                                            height={"100%"}
                                            width={"100%"}
                                            onClick={() => {
                                                setSelectedMyCollection({
                                                    ...item,
                                                    index
                                                })
                                            }}
                                        />
                                    </Frame>
                                </MyCollectionItem>
                            )
                        })}
                        {myColllections.length !== 0 && (
                            <div style={{ display: "flex", marginLeft: "10px" }}>
                                <StyledButton
                                    disabled={!selectedMyCollection}
                                    onClick={onLock}
                                >
                                    Deposit
                                </StyledButton>
                            </div>
                        )}
                    </MyCollection>

                </Body>
            </Modal>
        </>
    )
}

export default PetSitter