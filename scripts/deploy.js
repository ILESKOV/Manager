const hre = require("hardhat")
require("dotenv").config()
const {
    TKN_FEE,
    LOCKED_PERIOD,
    DEPOSITORS_LIMIT,
    FIRST_GROUP_ELEMENTS,
    SECOND_GROUP_ELEMENTS,
    THIRD_GROUP_ELEMENTS,
    FOURTH_GROUP_ELEMENTS,
} = process.env

async function main() {
    const Token = await hre.ethers.getContractFactory("TKN")
    const token = await Token.deploy()

    console.log("Token deployed to:", token.address)

    const Manager = await hre.ethers.getContractFactory("Manager")
    const manager = await Manager.deploy(
        token.address,
        TKN_FEE,
        LOCKED_PERIOD,
        DEPOSITORS_LIMIT,
        FIRST_GROUP_ELEMENTS,
        SECOND_GROUP_ELEMENTS,
        THIRD_GROUP_ELEMENTS,
        FOURTH_GROUP_ELEMENTS
    )

    console.log("Manager deployed to:", manager.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

