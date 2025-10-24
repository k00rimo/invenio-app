import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReplicaSelectorProps {
  replicasCount: number;
  selectedReplica: string;
  onSelectReplica: (replica: string) => void;
}

const ReplicaSelector = ({
  replicasCount,
  selectedReplica,
  onSelectReplica,
}: ReplicaSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Replica</span>
      <Select value={selectedReplica} onValueChange={onSelectReplica}>
        <SelectTrigger>
          <SelectValue placeholder="Select replica" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: replicasCount }, (_, i) => String(i + 1)).map(
            (rep) => (
              <SelectItem key={rep} value={rep}>
                Replica {rep}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ReplicaSelector;
