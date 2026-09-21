{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
        nodejs = pkgs.nodejs_24;
        yarn = pkgs.yarn.override { inherit nodejs; };
      in
      {
        devShells.default = pkgs.mkShell {
          name = "sandbag-dev";
          packages = [
            nodejs
            yarn
            pkgs.typescript
          ];
        };
      }
    );
}
