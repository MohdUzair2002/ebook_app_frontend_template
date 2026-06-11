import { Container } from "./Container";

export function SiteFooter() {
  const cols = [
    ["About Us", "Careers", "Affiliate Program"],
    ["Terms of Service", "Privacy Policy"],
    ["Contact Support"],
  ];
  return (
    <footer className="mt-24 border-t border-outline-variant/40 bg-background">
      <Container className="grid grid-cols-1 md:grid-cols-4 gap-10 py-14">
        <div>
          <h3 className="font-display text-2xl font-bold text-primary">KitabGhar</h3>
          <p className="mt-3 text-sm text-muted-foreground max-w-[14rem]">
            Elevating the art of reading and learning.
          </p>
          <p className="mt-8 text-xs text-muted-foreground">© 2024 KitabGhar Digital.</p>
        </div>
        {cols.map((col, i) => (
          <ul key={i} className="space-y-3 pt-1">
            {col.map((item) => (
              <li key={item}>
                <a href="#" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        ))}
      </Container>
    </footer>
  );
}
