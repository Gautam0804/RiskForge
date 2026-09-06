export default function PageHeader({
    title,
    description,
    action
}) {
    return (
        <div className="page-header">

            <div>
                <h1>{title}</h1>

                {description && (
                    <p>{description}</p>
                )}
            </div>

            {action && (
                <div>
                    {action}
                </div>
            )}

        </div>
    );
}