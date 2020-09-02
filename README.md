# Cardano Rosetta
[![CI][img_src_CI]][workflow_CI] [![Nightly][img_src_Nightly]][workflow_Nightly]

An implementation of [Rosetta 1.4.1] for [Cardano].

## Build

The Dockerfile can be [built anywhere], initially taking around 30 minutes:

```console
wget --secure-protocol=TLSv1_2 \
  -O- https://raw.githubusercontent.com/input-output-hk/cardano-rosetta/0.2.0/Dockerfile \
  | docker build \
    -t cardano-rosetta:0.2.0 -
```
**_Optionally_**  specify a [network] name, other than `mainnet`, using a build argument:

```console
  --build-arg=NETWORK=testnet
```

**_Optionally_** with cached build layers, useful for non-production use-cases:
```console
wget --secure-protocol=TLSv1_2 \
  -O- https://raw.githubusercontent.com/input-output-hk/cardano-rosetta/0.2.0/Dockerfile \
  | DOCKER_BUILDKIT=1 \
  docker build \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    --cache-from=inputoutput/cardano-rosetta:master \
    -t cardano-rosetta:0.2.0 -
```

## Run

Mount a single volume into the [standard storage location] mapping the server port to the host. 
See the complete [Docker run reference] for full control. 

```console
docker run \
  --name cardano-rosetta \
  -p 8080:8080 \
  -v cardano-rosetta:/data \
  cardano-rosetta:0.2.0 
```


## Documentation

| Link                               | Audience                                                     |
| ---                                | ---                                                          |
| [Construction API Documentation]   | Users of the Cardano Rosetta Construction API                |
| [Data API Documentation]           | Users of the Cardano Rosetta Data API                        |
| [Developer]                        | Core or external developers of cardano-rosetta-server        |
| [Maintainer]                       | Solution maintainer                                          |
| [QA]                               | Quality Assurance Engineers                                  |

<hr/>

<p align="center">
  <a href="https://github.com/input-output-hk/cardano-rosetta/blob/master/LICENSE.md"><img src="https://img.shields.io/github/license/input-output-hk/cardano-rosetta.svg?style=for-the-badge" /></a>
</p>

[img_src_CI]: https://github.com/input-output-hk/cardano-rosetta/workflows/CI/badge.svg
[workflow_CI]: https://github.com/input-output-hk/cardano-rosetta/actions?query=workflow%3ACI
[img_src_Nightly]: https://github.com/input-output-hk/cardano-rosetta/workflows/Nightly/badge.svg
[workflow_Nightly]: https://github.com/input-output-hk/cardano-rosetta/actions?query=workflow%3ANightly
[Rosetta 1.4.1]: https://www.rosetta-api.org/docs/1.4.1/welcome.html
[Cardano]: https://cardano.org/
[built anywhere]: https://www.rosetta-api.org/docs/node_deployment.html#build-anywhere
[network]: config/network
[standard storage location]: https://www.rosetta-api.org/docs/standard_storage_location.html
[Docker run reference]: https://docs.docker.com/engine/reference/run/
[Construction API Documentation]: https://www.rosetta-api.org/docs/construction_api_introduction.html
[Data API Documentation]: https://www.rosetta-api.org/docs/data_api_introduction.html
[Developer]: cardano-rosetta-server/README.md
[Maintainer]: docs/MAINTAINER.md
[QA]: docs/QA.md
