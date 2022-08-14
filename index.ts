import { createCanvas, loadImage } from "@napi-rs/canvas";

type UserStatus =
  | "online"
  | "idle"
  | "dnd"
  | "offline"
  | "invisible";

interface CardData {
  height: number;
  width: number;
  background: string;
  overlay: string;
  avatar?: string;
  status: UserStatus;
  maxed: boolean;
  badge?: string;
  progress_bar: {
    track: string;
    bar: string;
    maxed?: Array<string>;
  };
  rank: {
    data?: number;
    number_color: string;
    text_color: string;
  };
  level: {
    data?: number;
    number_color: string;
    text_color: string;
  };
  current_xp: {
    data?: number;
    color: string;
  };
  required_xp: {
    data?: number;
    color: string;
  };
  username: {
    data?: string;
    color: string;
  };
  discrim: {
    data?: string;
    color: string;
  };
}

const isUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch(_) {
    return false;
  }
};

export class Rankcard {
  private data: CardData;
  
  constructor() {
    this.data = {
      height: 280,
      width: 930,
      background: "#23272A",
      overlay: "#333640",
      status: "online",
      maxed: false,
      progress_bar: {
        track: "#484b4e",
        bar: "#ffffff"
      },
      rank: {
        number_color: "#f3f3f3",
        text_color: "#ffffff"
      },
      level: {
        number_color: "#f3f3f3",
        text_color: "#ffffff"
      },
      current_xp: {
        color: "#ffffff"
      },
      required_xp: {
        color: "#ffffff"
      },
      username: {
        color: "#ffffff"
      },
      discrim: {
        color: "#ffffff66"
      }
    };
  }

  public setBackgroundColor(color: string) {
    this.data.background = color;
    return this;
  }

  public setOverlayColor(color: string) {
    this.data.overlay = color;
    return this;
  }

  public setAvatar(url: string) {
    if(isUrl(url)) {
      this.data.avatar = url;
    }

    return this;
  }

  public setStatus(status: UserStatus) {
    this.data.status = status;
    return this;
  }

  public setProgressbarColor(color: string) {
    this.data.progress_bar.bar = color;
    return this;
  }

  public setProgressbarTrackColor(color: string) {
    this.data.progress_bar.track = color;
    return this;
  }

  public setRank(rank: number, rankColor?: string, textColor?: string) {
    if(rankColor) {
      this.data.rank.number_color = rankColor;
    }
    if(textColor) {
      this.data.rank.text_color = textColor;
    }

    this.data.rank.data = rank;
    return this;
  }

  public setLevel(level: number, levelColor?: string, textColor?: string) {
    if(levelColor) {
      this.data.level.number_color = levelColor;
    }
    if(textColor) {
      this.data.level.text_color = textColor;
    }

    this.data.level.data = level;
    return this;
  }

  public setCurrentXp(xp: number, color?: string) {
    if(color) {
      this.data.current_xp.color = color;
    }

    this.data.current_xp.data = xp;
    return this;
  }

  public setRequiredXp(xp: number, color?: string) {
    if(color) {
      this.data.required_xp.color = color;
    }

    this.data.required_xp.data = xp;
    return this;
  }

  public setUsername(name: string, color?: string) {
    if(color) {
      this.data.username.color = color;
    }

    this.data.username.data = (name.length > 11 ? name.substring(0, 11).trim() + "..." : name);
    return this;
  }

  public setDiscriminator(discriminator: string, color?: string) {
    if(color) {
      this.data.discrim.color = color;
    }

    this.data.discrim.data = `#${discriminator}`;
    return this;
  }

  public setMaxed(bool: boolean, colors?: Array<string>, badge?: string) {
    if(colors) {
      this.data.progress_bar.maxed = colors;
    }
    if(badge && isUrl(badge)) {
      this.data.badge = badge;
    }
    
    this.data.maxed = bool;
    return this;
  }

  public async build(text: { rank: string, level: string }) {
    const { avatar, width, height, background, overlay, status, username, discrim, rank, level, badge, current_xp, required_xp, maxed, progress_bar } = this.data;

    if(!avatar) {
      throw new Error("User's avatar was not set!");
    }
    if(typeof rank.data !== "number") {
      throw new Error("User's rank was not set!");
    }
    if(typeof level.data !== "number") {
      throw new Error("User's level was not set!");
    }
    if(typeof current_xp.data !== "number") {
      throw new Error("User's current xp was not set!");
    }
    if(typeof required_xp.data !== "number") {
      throw new Error("Required xp was not set!");
    }
    if(!username.data) {
      throw new Error("Username was not set!");
    }
    if(!discrim.data) {
      throw new Error("User's discriminator was not set!");
    }

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    const formattedXp = [this.formatNumber(current_xp.data), this.formatNumber(required_xp.data)];
    const progress = this.calcProgress(current_xp.data, required_xp.data);
    const avatarImage = await loadImage(avatar);

    // Background
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    // Overlay
    ctx.fillStyle = overlay;
    ctx.fillRect(15, 15, width - 30, height - 30);

    // Status
    ctx.fillStyle = (status === "online" ? "#43b581" : (status === "idle" ? "#faa61a" : (status === "dnd" ? "#f04747" : "#747f8e")));
    ctx.fillRect(280, 160, 20, 20);

    // Username
    ctx.textAlign = "start";
    ctx.font = "bold 38px MANROPE_BOLD";
    ctx.fillStyle = username.color;
    ctx.fillText(username.data, 310, 184);

    // Discriminator
    ctx.font = "38px MANROPE_REGULAR";
    ctx.fillStyle = discrim.color;
    ctx.fillText(discrim.data, 310 + ctx.measureText(username.data).width + 15, 184);
    
    // Rank
    ctx.font = "bold 45px MANROPE_BOLD";
    ctx.fillStyle = rank.text_color;
    ctx.fillText(text.rank, 440, 80);
    ctx.font = "45px MANROPE_REGULAR";
    ctx.fillStyle = rank.number_color;
    ctx.fillText(this.formatNumber(rank.data), 440 + ctx.measureText(text.rank).width + 30, 80);

    // Level
    ctx.font = "bold 45px MANROPE_BOLD";
    ctx.fillStyle = level.text_color;
    ctx.fillText(text.level, 672.5, 80);
    ctx.font = "45px MANROPE_REGULAR";
    ctx.fillStyle = level.number_color;
    ctx.fillText(`${level.data}`, 672.5 + ctx.measureText(text.level).width + 30, 80);

    // Progressbar track
    ctx.fillStyle = progress_bar.track;
    ctx.beginPath();
    ctx.arc(284, 216, 19, Math.PI * 1.5, Math.PI * 0.5, true);
    ctx.fill();
    ctx.arc(876, 216, 19, Math.PI * 1.5, Math.PI * 0.5, false);
    ctx.fill();
    ctx.closePath();
    ctx.fillRect(284, 197, 592, 38);
    ctx.restore();

    // Progressbar
    if(maxed) {
      if(progress_bar.maxed && progress_bar.maxed.length) {
        const gradient = ctx.createLinearGradient(287, 216, 873, 216);

        for(let i = 0; i < progress_bar.maxed.length; i++) {
          gradient.addColorStop(i / (progress_bar.maxed.length - 1), progress_bar.maxed[i]);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(284, 197, 592, 38);
        ctx.fillStyle = progress_bar.maxed[0];
        ctx.beginPath();
        ctx.arc(284, 216, 19, Math.PI * 1.5, Math.PI * 0.5, true);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = progress_bar.maxed[progress_bar.maxed.length - 1];
        ctx.beginPath();
        ctx.arc(876, 216, 19, Math.PI * 1.5, Math.PI * 0.5, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = progress_bar.bar;
        ctx.beginPath();
        ctx.arc(284, 216, 19, Math.PI * 1.5, Math.PI * 0.5, true);
        ctx.fill();
        ctx.arc(876, 216, 19, Math.PI * 1.5, Math.PI * 0.5, false);
        ctx.fill();
        ctx.closePath();
        ctx.fillRect(284, 197, 592, 38);
        ctx.restore();
      }
    } else {
      ctx.fillStyle = progress_bar.bar;
      ctx.beginPath();
      ctx.arc(284, 216, 19, Math.PI * 1.5, Math.PI * 0.5, true);
      ctx.fill();
      ctx.arc(284 + progress, 216, 19, Math.PI * 1.5, Math.PI * 0.5, false);
      ctx.fill();
      ctx.closePath();
      ctx.fillRect(284, 197, progress, 38);
      ctx.restore();
    }

    // Xp
    if(maxed && badge) {
      const badgeImage = await loadImage(badge);

      ctx.drawImage(badgeImage, 745, 100, 130, 130);
    } else if(!maxed) {
      ctx.textAlign = "end";
      ctx.font = "30px MANROPE_REGULAR";
      ctx.fillStyle = required_xp.color;
      ctx.fillText(`/ ${formattedXp[1]}`, 880, 184);
      ctx.fillStyle = current_xp.color;
      ctx.fillText(`${formattedXp[0]}`, 880 - ctx.measureText(` / ${formattedXp[1]}`).width, 184);
    }

    // Avatar
    ctx.beginPath();
    ctx.arc(140, 140, 105, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImage, 35, 35, 210, 210);
    ctx.restore();

    return canvas.encode("png");
  }

  private formatNumber(int: number) {
    if(!int) {
      return "0";
    }
    
    const inMillion = int / 1000000;
    const inKilo = int / 1000;

    if(inMillion > 1) {
      const splits = inMillion.toFixed(1).split(".");

      switch(parseInt(splits[1]) === 0) {
        case true:
          return `${inMillion.toFixed(0)}M`;
        case false:
          return `${inMillion.toFixed(1)}M`;
      }
    } else if(inKilo > 1) {
      const splits = inKilo.toFixed(1).split(".");

      switch(parseInt(splits[1]) === 0) {
        case true:
          return `${inKilo.toFixed(0)}K`;
        case false:
          return `${inKilo.toFixed(1)}K`;
      }
    }

    return `${int}`;
  }

  private calcProgress(current: number, required: number) {
    return Math.round(592 * (current / required));
  }
}