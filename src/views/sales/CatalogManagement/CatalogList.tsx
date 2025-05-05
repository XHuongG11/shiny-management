import reducer from './store'
import { injectReducer, useAppSelector } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import CategoriesTable from './components/CategoriesTable'
import CatalogTableTools from './components/CatalogTableTools'
import CollectionsTable from './components/CollectionsTable'

injectReducer('salesCatalog', reducer)

const CatalogList = () => {
    const type = useAppSelector((state) => state.salesCatalog?.catalog?.type)
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Catalog</h3>
                <CatalogTableTools />
            </div>
            {type === 'Category' ? <CategoriesTable /> : <CollectionsTable />}
        </AdaptableCard>
    )
}

export default CatalogList
