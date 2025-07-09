const BindingPage = async ({ params }: { params: { slug: string } }) => {
    console.log(await params)
    return (
        <div>
            edit {params.slug}
        </div>
    );
}

export default BindingPage;
