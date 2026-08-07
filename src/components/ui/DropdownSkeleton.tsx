import { CircleChevronDown } from "lucide-react";
import "./dropdown.scss";

export default function DropdownSkeleton() {
    return (
        <div className={`dropdown dropdown__skeleton`} aria-label="Carregando">
            <div className={`dropdown__search`} aria-hidden="true">
                <div className={`dropdown__skeleton-input`}>
                    <p>Carregando...</p>
                </div>

                <div className={`dropdown__skeleton-button`}>
                    <i>
                        <CircleChevronDown size={34} />
                    </i>
                </div>
            </div>
        </div>
    );
}
