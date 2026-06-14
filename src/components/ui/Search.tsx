import { SearchIcon } from "lucide-react";
import "./search.scss";

interface SearchProps {
    onSearch: (pesquisa: string) => void;
    placeholder?: string;
}
export default function Search({
    onSearch,
    placeholder = "Pesquisar",
}: SearchProps) {
    return (
        <div className="search">
            <input
                type="search"
                name="search-input"
                placeholder={placeholder}
                onChange={(e) => onSearch(e.target.value.toLowerCase())}
            />
            <i>
                <SearchIcon size={24} />
            </i>
        </div>
    );
}
