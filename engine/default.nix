{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs-18_x
    pkgs.alsa-lib
    pkgs.nodePackages.npm
  ];

  shellHook = ''
    export LD_LIBRARY_PATH="${pkgs.alsa-lib}/lib:$LD_LIBRARY_PATH"
    echo "WebSonic Engine Environment"
    echo "========================="
    echo "Node.js version: $(node --version)"
    echo "npm version: $(npm --version)"
    echo "ALSA lib is available in the path."
    echo ""
    echo "You can now run 'npm install' and 'npm test'."
  '';
}
