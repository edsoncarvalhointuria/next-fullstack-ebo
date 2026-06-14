import { useSearchParams } from "next/navigation";

export default function () {
    const params = useSearchParams();
    const id = params.get("id");
    return id;
}
