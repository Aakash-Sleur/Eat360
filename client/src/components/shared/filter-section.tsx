import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FilterOptions } from "@/lib/types"


export default function FilterSection({ filters, setFilters, tags }: { filters: FilterOptions, setFilters: (filters: FilterOptions) => void, tags?: string[] }) {
    const defaultTags = ["vegetarian", "vegan", "gluten-free", "keto", "quick", "easy"]

    return (
        <div className="space-y-6">
            <div>
                <h3 className="mb-2 text-sm font-medium text-dark-1">Tags</h3>
                <div className="space-y-2">
                    {(tags || defaultTags).map((tag) => (
                        <div key={tag} className="flex items-center">
                            <Checkbox
                                id={tag}
                                checked={filters.tags.includes(tag)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setFilters({ ...filters, tags: [...filters.tags, tag] })
                                    } else {
                                        setFilters({ ...filters, tags: filters.tags.filter(t => t !== tag) })
                                    }
                                }}
                            />
                            <label htmlFor={tag} className="ml-2 text-sm text-dark-1">
                                {tag}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="mb-2 text-sm font-medium text-dark-1">Premium Recipes</h3>
                <Select
                    value={filters.isPremium === null ? "all" : filters.isPremium.toString()}
                    onValueChange={(value) => setFilters({ ...filters, isPremium: value === "all" ? null : value === "true" })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select premium status" />
                    </SelectTrigger>
                    <SelectContent className="text-dark-1 bg-light-1">
                        <SelectItem value="all">All Recipes</SelectItem>
                        <SelectItem value="true">Premium Only</SelectItem>
                        <SelectItem value="false">Free Only</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <h3 className="mb-2 text-sm font-medium text-dark-1">Sort By</h3>
                <Select
                    value={filters.sortBy}
                    onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select sorting option" />
                    </SelectTrigger>
                    <SelectContent className="text-dark-1 bg-light-1">
                        <SelectItem value="date_desc">Newest First</SelectItem>
                        <SelectItem value="date_asc">Oldest First</SelectItem>
                        <SelectItem value="likes_desc">Most Liked</SelectItem>
                        <SelectItem value="views_desc">Most Viewed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
