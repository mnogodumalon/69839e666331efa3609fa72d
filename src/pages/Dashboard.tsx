import { useState, useEffect, useMemo } from 'react';
import type { Kategorien, Prioritaetsstufen, Statusverwaltung, Techniker } from '@/types/app';
import { LivingAppsService } from '@/services/livingAppsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  FolderOpen,
  Flag,
  CheckCircle,
  Plus,
  AlertCircle,
  Users,
  Mail,
  Phone,
  Briefcase,
  RefreshCw,
} from 'lucide-react';

interface DashboardData {
  kategorien: Kategorien[];
  prioritaetsstufen: Prioritaetsstufen[];
  statusverwaltung: Statusverwaltung[];
  techniker: Techniker[];
}

interface NewTechnikerForm {
  techniker_vorname: string;
  techniker_nachname: string;
  techniker_email: string;
  techniker_telefon: string;
  specialization: string;
  active: boolean;
}

const initialFormState: NewTechnikerForm = {
  techniker_vorname: '',
  techniker_nachname: '',
  techniker_email: '',
  techniker_telefon: '',
  specialization: '',
  active: true,
};

// Progress Ring Component
function ProgressRing({
  progress,
  size,
  strokeWidth,
  className = '',
}: {
  progress: number;
  size: number;
  strokeWidth: number;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <svg width={size} height={size} className={className}>
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{
          transition: 'stroke-dashoffset 600ms ease-out',
        }}
      />
    </svg>
  );
}

// Avatar with initials
function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="flex items-center justify-center rounded-full bg-accent text-accent-foreground font-medium"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}

// Loading State
function LoadingState() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 font-['Space_Grotesk',sans-serif]">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div>
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Hero skeleton */}
      <div className="flex justify-center mb-6">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center">
            <Skeleton className="h-44 w-44 rounded-full mb-4" />
            <Skeleton className="h-5 w-32" />
          </div>
        </Card>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-6 w-8 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Error State
function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-['Space_Grotesk',sans-serif]">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Fehler beim Laden</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">{error.message}</p>
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Erneut versuchen
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Empty State for Techniker List
function EmptyTechnikerState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Users className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold mb-2">Noch keine Techniker</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Fügen Sie Ihren ersten Techniker hinzu, um loszulegen.
      </p>
      <Button onClick={onAdd}>
        <Plus className="h-4 w-4 mr-2" />
        Techniker hinzufügen
      </Button>
    </div>
  );
}

// Techniker Card (Mobile)
function TechnikerCard({
  techniker,
  onClick,
}: {
  techniker: Techniker;
  onClick: () => void;
}) {
  const displayName =
    techniker.fields.display_name ||
    `${techniker.fields.techniker_vorname || ''} ${techniker.fields.techniker_nachname || ''}`.trim() ||
    'Unbekannt';

  return (
    <div
      className="flex items-center gap-3 p-4 bg-card rounded-xl cursor-pointer hover:shadow-md transition-all duration-150 active:scale-[0.98]"
      onClick={onClick}
      style={{ minHeight: 72 }}
    >
      <Avatar name={displayName} size={40} />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-base truncate">{displayName}</div>
        {techniker.fields.specialization && (
          <div className="text-sm text-muted-foreground truncate">
            {techniker.fields.specialization}
          </div>
        )}
      </div>
      <div
        className={`w-2.5 h-2.5 rounded-full ${
          techniker.fields.active !== false ? 'bg-green-500' : 'bg-gray-400'
        }`}
      />
    </div>
  );
}

// Techniker Row (Desktop sidebar)
function TechnikerRow({
  techniker,
  onClick,
}: {
  techniker: Techniker;
  onClick: () => void;
}) {
  const displayName =
    techniker.fields.display_name ||
    `${techniker.fields.techniker_vorname || ''} ${techniker.fields.techniker_nachname || ''}`.trim() ||
    'Unbekannt';

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors duration-150"
      onClick={onClick}
    >
      <Avatar name={displayName} size={36} />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-[15px] truncate">{displayName}</div>
        {techniker.fields.specialization && (
          <div className="text-[13px] text-muted-foreground truncate">
            {techniker.fields.specialization}
          </div>
        )}
      </div>
      <div
        className={`w-2 h-2 rounded-full flex-shrink-0 ${
          techniker.fields.active !== false ? 'bg-green-500' : 'bg-gray-400'
        }`}
      />
    </div>
  );
}

// Techniker Detail Sheet
function TechnikerDetailSheet({
  techniker,
  open,
  onOpenChange,
}: {
  techniker: Techniker | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!techniker) return null;

  const displayName =
    techniker.fields.display_name ||
    `${techniker.fields.techniker_vorname || ''} ${techniker.fields.techniker_nachname || ''}`.trim() ||
    'Unbekannt';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="text-left">
          <div className="flex items-center gap-4 mb-4">
            <Avatar name={displayName} size={56} />
            <div>
              <SheetTitle className="text-xl">{displayName}</SheetTitle>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    techniker.fields.active !== false ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                />
                <span className="text-sm text-muted-foreground">
                  {techniker.fields.active !== false ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-4 mt-4">
          {techniker.fields.techniker_email && (
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-accent p-2">
                <Mail className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">E-Mail</div>
                <a
                  href={`mailto:${techniker.fields.techniker_email}`}
                  className="text-primary hover:underline"
                >
                  {techniker.fields.techniker_email}
                </a>
              </div>
            </div>
          )}

          {techniker.fields.techniker_telefon && (
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-accent p-2">
                <Phone className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Telefon</div>
                <a
                  href={`tel:${techniker.fields.techniker_telefon}`}
                  className="text-primary hover:underline"
                >
                  {techniker.fields.techniker_telefon}
                </a>
              </div>
            </div>
          )}

          {techniker.fields.specialization && (
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-accent p-2">
                <Briefcase className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Spezialisierung</div>
                <div>{techniker.fields.specialization}</div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Add Techniker Dialog
function AddTechnikerDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<NewTechnikerForm>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await LivingAppsService.createTechnikerEntry({
        techniker_vorname: form.techniker_vorname || undefined,
        techniker_nachname: form.techniker_nachname || undefined,
        techniker_email: form.techniker_email || undefined,
        techniker_telefon: form.techniker_telefon || undefined,
        specialization: form.specialization || undefined,
        active: form.active,
        display_name:
          `${form.techniker_vorname} ${form.techniker_nachname}`.trim() || undefined,
      });
      setForm(initialFormState);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Techniker hinzufügen</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vorname">Vorname *</Label>
                <Input
                  id="vorname"
                  value={form.techniker_vorname}
                  onChange={(e) =>
                    setForm({ ...form, techniker_vorname: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nachname">Nachname *</Label>
                <Input
                  id="nachname"
                  value={form.techniker_nachname}
                  onChange={(e) =>
                    setForm({ ...form, techniker_nachname: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={form.techniker_email}
                onChange={(e) =>
                  setForm({ ...form, techniker_email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefon">Telefon</Label>
              <Input
                id="telefon"
                type="tel"
                value={form.techniker_telefon}
                onChange={(e) =>
                  setForm({ ...form, techniker_telefon: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Spezialisierung</Label>
              <Textarea
                id="specialization"
                value={form.specialization}
                onChange={(e) =>
                  setForm({ ...form, specialization: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="active">Aktiv</Label>
              <Switch
                id="active"
                checked={form.active}
                onCheckedChange={(checked) => setForm({ ...form, active: checked })}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Abbrechen
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Speichern...' : 'Speichern'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Stat Pill (Mobile)
function StatPill({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-full min-w-[120px]">
      <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <span className="font-semibold text-lg">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

// Stat Card (Desktop)
function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-150 hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-accent p-3">
            <Icon className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <div className="text-3xl font-semibold">{value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTechniker, setSelectedTechniker] = useState<Techniker | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showAllTechniker, setShowAllTechniker] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [kategorien, prioritaetsstufen, statusverwaltung, techniker] =
        await Promise.all([
          LivingAppsService.getKategorien(),
          LivingAppsService.getPrioritaetsstufen(),
          LivingAppsService.getStatusverwaltung(),
          LivingAppsService.getTechniker(),
        ]);
      setData({ kategorien, prioritaetsstufen, statusverwaltung, techniker });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unbekannter Fehler'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Computed values
  const stats = useMemo(() => {
    if (!data) return null;

    const activeTechniker = data.techniker.filter(
      (t) => t.fields.active !== false
    ).length;
    const totalTechniker = data.techniker.length;
    const activeKategorien = data.kategorien.filter(
      (k) => k.fields.active !== false
    ).length;
    const activePrioritaeten = data.prioritaetsstufen.filter(
      (p) => p.fields.active !== false
    ).length;
    const activeStatus = data.statusverwaltung.filter(
      (s) => s.fields.active !== false
    ).length;

    return {
      activeTechniker,
      totalTechniker,
      technikerProgress:
        totalTechniker > 0 ? (activeTechniker / totalTechniker) * 100 : 0,
      activeKategorien,
      activePrioritaeten,
      activeStatus,
    };
  }, [data]);

  // Sort techniker by sortorder, then by nachname
  const sortedTechniker = useMemo(() => {
    if (!data) return [];
    return [...data.techniker].sort((a, b) => {
      const orderA = a.fields.sortorder ?? Infinity;
      const orderB = b.fields.sortorder ?? Infinity;
      if (orderA !== orderB) return orderA - orderB;
      return (a.fields.techniker_nachname || '').localeCompare(
        b.fields.techniker_nachname || ''
      );
    });
  }, [data]);

  const displayedTechniker = showAllTechniker
    ? sortedTechniker
    : sortedTechniker.slice(0, 5);

  const handleTechnikerClick = (techniker: Techniker) => {
    setSelectedTechniker(techniker);
    setSheetOpen(true);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchData} />;
  if (!data || !stats) return null;

  return (
    <div className="min-h-screen bg-background font-['Space_Grotesk',sans-serif]">
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium">Ticket System</h1>
            <Button
              size="icon"
              className="rounded-full h-11 w-11"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Mobile Content */}
        <main className="px-4 pb-24">
          {/* Hero Section */}
          <section className="py-8 flex flex-col items-center">
            <div className="relative">
              <ProgressRing
                progress={stats.technikerProgress}
                size={180}
                strokeWidth={10}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold">{stats.activeTechniker}</span>
                <span className="text-sm text-muted-foreground">
                  von {stats.totalTechniker} aktiv
                </span>
              </div>
            </div>
            <span className="mt-4 text-base font-medium">Techniker</span>
          </section>

          {/* Quick Stats Row */}
          <section className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-4">
              <StatPill
                icon={FolderOpen}
                value={stats.activeKategorien}
                label="Kategorien"
              />
              <StatPill
                icon={Flag}
                value={stats.activePrioritaeten}
                label="Prioritäten"
              />
              <StatPill
                icon={CheckCircle}
                value={stats.activeStatus}
                label="Status"
              />
            </div>
          </section>

          {/* Techniker List */}
          <section className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Team</h2>
              {sortedTechniker.length > 5 && (
                <button
                  className="text-sm text-primary hover:underline"
                  onClick={() => setShowAllTechniker(!showAllTechniker)}
                >
                  {showAllTechniker ? 'Weniger anzeigen' : 'Alle anzeigen'}
                </button>
              )}
            </div>
            {sortedTechniker.length === 0 ? (
              <EmptyTechnikerState onAdd={() => setDialogOpen(true)} />
            ) : (
              <div className="space-y-2">
                {displayedTechniker.map((techniker, index) => (
                  <div
                    key={techniker.record_id}
                    className="animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <TechnikerCard
                      techniker={techniker}
                      onClick={() => handleTechnikerClick(techniker)}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* Fixed Bottom Action Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border safe-area-pb">
          <Button
            className="w-full h-[52px] text-base rounded-xl"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Techniker hinzufügen
          </Button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Desktop Header */}
        <header className="h-[72px] border-b border-border px-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Human in Command</h1>
            <p className="text-sm text-muted-foreground">
              Ticket System Verwaltung
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Techniker hinzufügen
          </Button>
        </header>

        {/* Desktop Content: 65/35 split */}
        <div className="flex">
          {/* Main Content (65%) */}
          <main className="flex-1 p-6" style={{ maxWidth: '65%' }}>
            {/* Hero Card */}
            <Card className="mb-6 shadow-sm">
              <CardContent className="py-12 flex flex-col items-center">
                <div className="relative">
                  <ProgressRing
                    progress={stats.technikerProgress}
                    size={220}
                    strokeWidth={12}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-7xl font-bold">
                      {stats.activeTechniker}
                    </span>
                    <span className="text-base text-muted-foreground">
                      von {stats.totalTechniker} aktiv
                    </span>
                  </div>
                </div>
                <span className="mt-6 text-lg font-medium">Techniker im Team</span>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div
                className="animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: '100ms' }}
              >
                <StatCard
                  icon={FolderOpen}
                  value={stats.activeKategorien}
                  label="Kategorien"
                />
              </div>
              <div
                className="animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: '200ms' }}
              >
                <StatCard
                  icon={Flag}
                  value={stats.activePrioritaeten}
                  label="Prioritätsstufen"
                />
              </div>
              <div
                className="animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: '300ms' }}
              >
                <StatCard
                  icon={CheckCircle}
                  value={stats.activeStatus}
                  label="Statuswerte"
                />
              </div>
            </div>
          </main>

          {/* Sidebar (35%) */}
          <aside
            className="border-l border-border p-6"
            style={{ width: '35%', maxHeight: 'calc(100vh - 72px)', overflowY: 'auto' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Team Übersicht</h2>
                <span className="px-2 py-0.5 text-xs bg-muted rounded-full">
                  {stats.totalTechniker}
                </span>
              </div>
            </div>

            {sortedTechniker.length === 0 ? (
              <EmptyTechnikerState onAdd={() => setDialogOpen(true)} />
            ) : (
              <div className="space-y-2">
                {sortedTechniker.map((techniker, index) => (
                  <div
                    key={techniker.record_id}
                    className="animate-in fade-in slide-in-from-right-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TechnikerRow
                      techniker={techniker}
                      onClick={() => handleTechnikerClick(techniker)}
                    />
                  </div>
                ))}
              </div>
            )}

            <button className="w-full mt-4 text-sm text-primary hover:underline text-center">
              Alle Techniker verwalten
            </button>
          </aside>
        </div>
      </div>

      {/* Dialogs & Sheets */}
      <AddTechnikerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchData}
      />
      <TechnikerDetailSheet
        techniker={selectedTechniker}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
