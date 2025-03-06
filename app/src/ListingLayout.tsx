const ListingLayout = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="h-full w-full flex max-h-full min-h-full">
            {children}
        </div>
    );
}

export default ListingLayout;
