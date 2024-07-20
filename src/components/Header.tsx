import Image from "next/image"
export default function Header() {
    return (
        <div>
            <div>
                <Image
                src="/everest_logo.jpeg"
                width={100}
                height={100}
                alt="Everest"
                />
            </div>
        </div>
    )
}