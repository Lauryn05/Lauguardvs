
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// Sample rules data
const initialRules = [
  {
    id: 1,
    name: "Email Address Masking",
    pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b",
    replacement: "****@****.***",
    active: true,
    type: "masking"
  },
  {
    id: 2,
    name: "API Key Detection",
    pattern: "\\b(?:api[_-]?key|apikey)[\\s:=]+[\"']?([\\w]{16,})[\"']?",
    replacement: "[API_KEY_MASKED]",
    active: true,
    type: "masking"
  },
  {
    id: 3,
    name: "Credit Card Number",
    pattern: "\\b(?:\\d{4}[- ]?){3}\\d{4}\\b",
    replacement: "****-****-****-****",
    active: true,
    type: "masking"
  },
  {
    id: 4,
    name: "Prompt Injection Detection",
    pattern: "\\b(?:ignore|forget|disregard)\\s+(?:previous|earlier|all)?\\s*(?:instructions|prompt|rules)\\b",
    replacement: "",
    active: true,
    type: "adversarial"
  },
  {
    id: 5,
    name: "System Prompt Extraction",
    pattern: "\\b(?:system|initial|original)\\s+(?:prompt|instruction|role|directive)\\b",
    replacement: "",
    active: true,
    type: "adversarial"
  }
];

const RuleSettings: React.FC = () => {
  const [rules, setRules] = useState(initialRules);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    pattern: "",
    replacement: "",
    type: "masking"
  });
  const { toast } = useToast();

  const handleAddRule = () => {
    if (!newRule.name || !newRule.pattern) {
      toast({
        title: "Error",
        description: "Name and pattern are required",
        variant: "destructive"
      });
      return;
    }

    try {
      // Test if the regex is valid
      new RegExp(newRule.pattern);
      
      const rule = {
        ...newRule,
        id: rules.length + 1,
        active: true
      };
      
      setRules([...rules, rule]);
      setNewRule({
        name: "",
        pattern: "",
        replacement: "",
        type: "masking"
      });
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: `Rule "${newRule.name}" has been created`,
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Invalid regular expression pattern",
        variant: "destructive"
      });
    }
  };

  const toggleRuleStatus = (id: number) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, active: !rule.active } : rule
    ));

    const rule = rules.find(r => r.id === id);
    if (rule) {
      toast({
        title: "Status Updated",
        description: `Rule "${rule.name}" is now ${!rule.active ? 'active' : 'inactive'}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Security Rules</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Rule</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Security Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rule Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g., Phone Number Masking" 
                  value={newRule.name}
                  onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Rule Type</Label>
                <Select 
                  defaultValue="masking"
                  onValueChange={(value) => setNewRule({...newRule, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masking">Masking</SelectItem>
                    <SelectItem value="adversarial">Adversarial Detection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pattern">
                  Regex Pattern
                  <span className="ml-1 text-xs text-muted-foreground">(JavaScript RegExp)</span>
                </Label>
                <Textarea 
                  id="pattern" 
                  placeholder="e.g., \b\d{3}[-.]?\d{3}[-.]?\d{4}\b" 
                  value={newRule.pattern}
                  onChange={(e) => setNewRule({...newRule, pattern: e.target.value})}
                />
              </div>
              {newRule.type === "masking" && (
                <div className="space-y-2">
                  <Label htmlFor="replacement">Replacement</Label>
                  <Input 
                    id="replacement" 
                    placeholder="e.g., ***-***-****" 
                    value={newRule.replacement}
                    onChange={(e) => setNewRule({...newRule, replacement: e.target.value})}
                  />
                </div>
              )}
              <Button onClick={handleAddRule} className="w-full">Create Rule</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Security Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Pattern</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Replacement</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell className="font-mono text-xs max-w-[200px] truncate">
                    {rule.pattern}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        rule.type === 'masking'
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                      }
                    >
                      {rule.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{rule.replacement || 'N/A'}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={rule.active} 
                      onCheckedChange={() => toggleRuleStatus(rule.id)} 
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Test Area */}
      <Card>
        <CardHeader>
          <CardTitle>Test Security Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea 
              placeholder="Type a message with sensitive information to test masking rules..." 
              className="min-h-[100px]"
            />
            <Button>Test Rules</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RuleSettings;
