# AXIOM Architecture

User prompt -> planner -> App Blueprint -> deterministic renderer/code generator -> live preview -> export/publish.

The Blueprint is the stable contract between AI planning and application generation. This prevents uncontrolled direct code generation.

Hosted AI credentials must remain server-side. Users do not enter provider API keys into the public builder.

The root index.html is dependency-free and runs directly in a browser.