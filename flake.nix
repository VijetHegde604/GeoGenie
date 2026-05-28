{
  description = "GeoGenie development shell";

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
      in
      {
        devShells.default = pkgs.mkShell {
          name = "geogenie-dev-shell";

          packages = with pkgs; [
            nodejs
            watchman
            jq
            git
            python3
          ];

          shellHook = ''
            export EXPO_NO_TELEMETRY=1
            export npm_config_fund=false
            export npm_config_audit=false

            echo "GeoGenie dev shell loaded"
            echo "Node: $(node --version) | npm: $(npm --version)"
            echo "Run: npm install && npm run start"
          '';
        };
      }
    );
}
