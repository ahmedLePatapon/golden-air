import {
    Button,
    Input,
    Badge,
    ExclusiveBadge,
    BestsellerBadge,
    NewBadge,
    VerifiedBadge,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardImage,
    Icon,
} from '@/components/ui'

export default function TestUIPage() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark p-8">
            <div className="max-w-6xl mx-auto space-y-16">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Design System - Golden Air</h1>
                    <p className="text-gray-500 dark:text-text-muted">Composants UI de base pour l'application</p>
                </div>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Icons</h2>
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white"><Icon name="diamond" size="sm" /> sm</div>
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white"><Icon name="spa" size="md" /> md</div>
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white"><Icon name="star" size="lg" filled /> lg filled</div>
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white"><Icon name="favorite" size="xl" /> xl</div>
                        <div className="flex items-center gap-2 text-primary"><Icon name="sports_tennis" size="2xl" /> 2xl primary</div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Buttons</h2>
                    <div className="space-y-6">
                        <div className="flex flex-wrap gap-4">
                            <Button variant="primary">Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="link">Link</Button>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Button size="sm">Small</Button>
                            <Button size="md">Medium</Button>
                            <Button size="lg">Large</Button>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Button leftIcon="search">With Left Icon</Button>
                            <Button rightIcon="arrow_forward">With Right Icon</Button>
                            <Button disabled>Disabled</Button>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Button variant="icon" size="icon" leftIcon="favorite" />
                            <Button variant="icon-ghost" size="icon" leftIcon="close" />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Inputs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                        <Input placeholder="Default input" />
                        <Input placeholder="With label" label="Destination" hint="Entrez votre destination" />
                        <Input placeholder="Search..." leftIcon="search" />
                        <Input placeholder="Glass variant" variant="glass" leftIcon="location_on" />
                        <Input placeholder="With error" error="Email invalide" />
                        <Input placeholder="Large size" inputSize="xl" leftIcon="calendar_month" />
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Badges</h2>
                    <div className="flex flex-wrap gap-4">
                        <ExclusiveBadge />
                        <BestsellerBadge />
                        <NewBadge />
                        <VerifiedBadge />
                        <Badge variant="tag">Tennis</Badge>
                        <Badge variant="tag">Golf</Badge>
                        <Badge variant="label">Ultra-Luxe</Badge>
                        <Badge variant="outline">Custom</Badge>
                        <Badge variant="solid" size="lg">Large Badge</Badge>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card variant="default" padding="md">
                            <CardTitle>Default Card</CardTitle>
                            <CardDescription>Une carte d'exemple simple.</CardDescription>
                        </Card>

                        <Card variant="glass" padding="md">
                            <CardTitle>Glass Card</CardTitle>
                            <CardDescription>Carte avec effet glass morphism.</CardDescription>
                        </Card>

                        <Card variant="feature" hover="glow" padding="lg">
                            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">Icon</div>
                            <CardTitle>Feature Card</CardTitle>
                            <CardDescription>Carte feature avec hover glow.</CardDescription>
                        </Card>

                        <Card variant="image" hover="lift" className="col-span-1">
                            <CardImage src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&q=80" alt="hero" />
                        </Card>

                        <Card variant="elevated" className="col-span-1 md:col-span-2">
                            <CardHeader>
                                <CardTitle>Elevated Card</CardTitle>
                                <CardDescription>Carte élevée avec ombre.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                Contenu de la carte élevé.
                            </CardContent>
                        </Card>
                    </div>
                </section>

            </div>
        </div>
    )
}
