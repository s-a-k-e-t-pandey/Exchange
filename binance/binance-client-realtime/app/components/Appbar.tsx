import { Vault, ChevronDown } from "lucide-react"
import GradientIcon from "./GradientIcons"
import { PrimaryButton, SuccessButton } from "./core/Button"


export const Appbar = () => {

    return (
        <>
            <div className="relative flex h-14 w-full flex-col justify-center bg-black">
                <div className="grid grid-cols-3">
                    <div className="flex item-center flex-row">
                        <div className="flex">
                            <div className="absolute right-0 top-0 flex h-full w-full items-center gap-2 rounded-md bg--700 px-4 py-2">
                                <div className="">
                                    <GradientIcon Icon={Vault}></GradientIcon>
                                </div>
                                <div className="text-2xl font-bold text-gray-100">Exchange</div>
                                <div className="flex items-center justify-center flex-row gap-20 xs:flex sm:mx-12 sm:gap-12">
                                    <a className="items-center text-md text-center font-semibold rounded-lg text-gray-100 flex flex-row justify-center">Spot</a>
                                    <a className="items-center text-md text-center font-semibold rounded-lg text-gray-100 flex flex-row">Futures</a>
                                    <a className="items-center text-md text-center font-semibold rounded-lg text-gray-100">Lend</a>
                                    <button className="items-center text-md text-center font-semibold rounded-lg text-gray-100 flex flex-row">
                                        More
                                        <ChevronDown color="#f3eded" absoluteStrokeWidth />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    <div className="flex item-end flex-row justify-end">
                        <div className="p-2 mr-2">
                            <SuccessButton>Deposit</SuccessButton>
                            <PrimaryButton>Withdraw</PrimaryButton>
                        </div>
                    </div>
            </div>
        </>
    )
}