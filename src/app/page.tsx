<form onSubmit={onSubmit} className="space-y-4">
  <div>
    <Label>Nome completo</Label>
    <Input
      value={nome}
      onChange={(e) => setNome(e.target.value)}
      required
    />
  </div>

  <div>
    <Label>Data de nascimento (DD/MM/AAAA)</Label>
    <Input
      value={nascimento}
      onChange={(e) => setNascimento(e.target.value)}
      placeholder="10/05/1983"
      required
    />
  </div>

  <div>
    <Label>Sentimentos recentes (opcional)</Label>
    <Input
      value={sentimentos}
      onChange={(e) => setSentimentos(e.target.value)}
    />
  </div>

  <Button type="submit" disabled={loading}>
    {loading ? "Gerando…" : "Gerar mapa"}
  </Button>
</form>
