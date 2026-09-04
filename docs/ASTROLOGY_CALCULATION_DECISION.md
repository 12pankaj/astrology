# Astrology Calculation Decision Record (`ASTROLOGY_CALCULATION_DECISION.md`)

## 1. Astronomical Ephemeris & Ayanamsha Decision

### Ephemeris Source
The platform uses deterministic high-precision astronomical algorithms (Swiss Ephemeris mathematical formulas ported to pure TypeScript).
- **Primary Ayanamsha**: Lahiri (Chitrapaksha) Ayanamsha by default.
  - Formula: $A(t) = 22.46047° + 1.3960416° \cdot t + 0.000308° \cdot t^2$ where $t$ is Julian Centuries from J2000.0.
- **Configurable Ayanamshas**: Raman, KP (Krishnamurti), Yukteshwar.

### Tropical to Sidereal Conversion
$$\text{Sidereal Longitude} = (\text{Tropical Longitude} - \text{Ayanamsha}) \pmod{360°}$$

---

## 2. Ascendant (Lagna) & House System Algorithms

### Ascendant Calculation Formula
Given UTC timestamp $T$, Latitude $\phi$, Longitude $\lambda$:
1. Calculate Greenwhich Mean Sidereal Time (GMST).
2. Calculate Local Sidereal Time (LST):
   $$\text{LST} = \text{GMST} + \frac{\lambda}{15}$$
3. Calculate Obliquity of Ecliptic $\epsilon \approx 23.4393°$.
4. Calculate Ascendant $\text{RAMC} = \text{LST} \times 15°$:
   $$\lambda_{\text{Asc}} = \operatorname{atan2}\left(\cos(\text{RAMC}), -\sin(\text{RAMC}) \cos(\epsilon) - \tan(\phi) \sin(\epsilon)\right)$$
5. Convert Tropical Ascendant to Sidereal Ascendant by subtracting Ayanamsha.

### House System Support
- **Equal House System**: 30° per house starting from Ascendant degree.
- **Sripati / Placidus Bhava Madhya & Bhava Sandhi**: Accurately calculates cusp midpoints and boundaries.

---

## 3. 27 Nakshatras & 108 Padas Division

- Total Ecliptic Circle: 360°
- Each Nakshatra Span: $\frac{360°}{27} = 13°20' = 13.3333°$
- Each Pada Span: $\frac{13°20'}{4} = 3°20' = 3.3333°$
- Formula for Nakshatra Index ($0$ to $26$):
  $$\text{Nakshatra Index} = \lfloor \frac{\text{Moon Sidereal Longitude}}{13.333333°} \rfloor$$
- Formula for Pada ($1$ to $4$):
  $$\text{Pada} = \lfloor \frac{(\text{Moon Sidereal Longitude} \bmod 13.333333°)}{3.333333°} \rfloor + 1$$

---

## 4. Divisional Charts Algorithms (Shodashvarga D1 - D60)

### D9 (Navamsha) Algorithm
Each sign is divided into 9 divisions of 3°20' each.
- Fire signs (Aries, Leo, Sag): Start counting from Aries.
- Earth signs (Taurus, Virgo, Cap): Start counting from Capricorn.
- Air signs (Gemini, Libra, Aqua): Start counting from Libra.
- Water signs (Cancer, Scorp, Pisces): Start counting from Cancer.

### D10 (Dashamsha) Algorithm
Each sign is divided into 10 divisions of 3° each.
- Odd signs: Start counting from the sign itself.
- Even signs: Start counting from the 9th sign from itself.

### D60 (Shashtiamsha) Algorithm
Each sign is divided into 60 divisions of 0°30' (30 arcminutes) each.
- Odd signs: Direct order (1 to 60).
- Even signs: Reverse order (60 to 1).

---

## 5. Dasha Engine (`Vimshottari Dasha`)

- Total Duration: 120 Years.
- Sequence & Duration of Grahas:
  1. Sun (6 yrs)
  2. Moon (10 yrs)
  3. Mars (7 yrs)
  4. Rahu (18 yrs)
  5. Jupiter (16 yrs)
  6. Saturn (19 yrs)
  7. Mercury (17 yrs)
  8. Ketu (7 yrs)
  9. Venus (20 yrs)
- **Balance of Dasha at Birth**:
  $$\text{Fraction Remaining} = 1 - \frac{\text{Moon Longitude inside Nakshatra}}{13°20'}$$
  $$\text{Balance Period} = \text{Fraction Remaining} \times \text{Mahadasha Total Years}$$
